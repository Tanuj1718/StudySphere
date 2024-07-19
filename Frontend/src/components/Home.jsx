import { useEffect, useState } from 'react';

function Home() {
  const [posts, setPosts] = useState([]);

  useEffect(() => {
    const fetchPosts = async () => {
      const token = localStorage.getItem('token');
      if (!token) return;

      const response = await fetch('http://localhost:8000/api/posts', {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });

      if (response.ok) {
        const data = await response.json();
        setPosts(data);
      } else {
        console.error('Failed to fetch posts');
      }
    };

    fetchPosts();
  }, []);

  return (
    <div>
      <h1 className="text-2xl font-bold mb-4">Your Posts</h1>
      {posts.length === 0 ? (
        <p>No posts found.</p>
      ) : (
        posts.map(post => (
          <div key={post.Id} className="border p-4 mb-4 rounded">
            <h2 className="text-xl font-bold text-black">{post.Title}</h2>
            <p>{post.Content}</p>
            <a href={post.Link} target="_blank" rel="noopener noreferrer">Link: {post.Link}</a>
            <p className="text-sm text-gray-600">Posted by: {post.Username}</p>
          </div>
        ))
      )}
    </div>
  );
}

export default Home;
