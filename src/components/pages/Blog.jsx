import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { FaSpinner } from 'react-icons/fa';

const Blog = () => {
  const [posts, setPosts] = useState([]);
  const [title, setTitle] = useState('');
  const [content, setContent] = useState('');
  const [message, setMessage] = useState({ text: '', isError: false });
  const [isLoading, setIsLoading] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    const authToken = localStorage.getItem('authToken');
    if (!authToken) {
      navigate('/login');
      return;
    }
    fetchPosts();
  }, [navigate]);

  const fetchPosts = async () => {
    try {
      setIsLoading(true);
      const response = await fetch('https://layole-backend.onrender.com/api/blogs', {
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('authToken')}`
        }
      });
      
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const data = await response.json();
      if (!Array.isArray(data)) {
        throw new Error('Received invalid data format from server');
      }
      setPosts(data);
    } catch (error) {
      console.error('Error fetching posts:', error);
      setMessage({ 
        text: error.message || 'Error loading posts. Please try again later.', 
        isError: true 
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!title.trim() || !content.trim()) {
      setMessage({ 
        text: 'Both title and content are required', 
        isError: true 
      });
      return;
    }

    setIsLoading(true);
    
    try {
      const user = JSON.parse(localStorage.getItem('user') || {});
      const response = await fetch('https://layole-backend.onrender.com/api/blogs', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${localStorage.getItem('authToken')}`
        },
        body: JSON.stringify({ 
          title: title.trim(), 
          content: content.trim(), 
          author: user.username || 'Anonymous' 
        })
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || 'Failed to create post');
      }

      const data = await response.json();
      setMessage({ 
        text: 'Post published successfully!', 
        isError: false 
      });
      setTitle('');
      setContent('');
      fetchPosts();
    } catch (error) {
      console.error('Post creation error:', error);
      setMessage({ 
        text: error.message || 'An error occurred while creating the post', 
        isError: true 
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="pt-20 pb-16">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Create Post Section */}
        <section className="bg-white rounded-lg shadow-md p-6 mb-12">
          <h2 className="text-2xl font-bold mb-6 text-gray-800">Create a New Post</h2>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <input 
                type="text" 
                id="title" 
                placeholder="Title" 
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                required 
                maxLength={100}
                disabled={isLoading}
              />
            </div>
            <div>
              <textarea 
                id="content" 
                placeholder="Write your post here..." 
                value={content}
                onChange={(e) => setContent(e.target.value)}
                className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 min-h-[200px]"
                required
                disabled={isLoading}
              />
            </div>
            <button 
              type="submit" 
              disabled={isLoading || !title.trim() || !content.trim()}
              className={`bg-blue-800 hover:bg-blue-900 text-white py-2 px-6 rounded-md font-medium flex items-center ${isLoading ? 'opacity-70' : ''}`}
            >
              {isLoading ? (
                <>
                  <FaSpinner className="animate-spin mr-2" />
                  <span>Publishing...</span>
                </>
              ) : (
                <span>Publish Post</span>
              )}
            </button>
          </form>
          {message.text && (
            <div 
              className={`mt-4 p-3 rounded-md ${message.isError ? 'bg-red-100 text-red-700' : 'bg-green-100 text-green-700'}`}
            >
              {message.text}
            </div>
          )}
        </section>

        {/* Posts Section */}
        <section>
          <h2 className="text-2xl font-bold mb-6 text-gray-800">Latest Posts</h2>
          {isLoading && posts.length === 0 ? (
            <div className="flex items-center justify-center py-12">
              <FaSpinner className="animate-spin text-blue-800 text-2xl mr-3" />
              <span>Loading posts...</span>
            </div>
          ) : (
            <div className="space-y-8">
              {posts.length === 0 ? (
                <p className="text-gray-600 text-center py-8">No posts yet. Be the first to post!</p>
              ) : (
                posts.map(post => (
                  <article key={post._id || post.id} className="bg-white rounded-lg shadow-md p-6">
                    <h3 className="text-xl font-bold mb-2 text-gray-800">{post.title}</h3>
                    <div className="flex items-center text-sm text-gray-500 mb-4">
                      <span className="mr-4">By {post.author || 'Anonymous'}</span>
                      <span>
                        {post.createdAt ? new Date(post.createdAt).toLocaleDateString() : 'Unknown date'}
                      </span>
                    </div>
                    <div className="text-gray-700">
                      {post.content.split('\n').map((paragraph, i) => (
                        <p key={i} className="mb-4">{paragraph}</p>
                      ))}
                    </div>
                  </article>
                ))
              )}
            </div>
          )}
        </section>
      </div>
    </div>
  );
};

export default Blog;