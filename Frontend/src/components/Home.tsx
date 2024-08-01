'use client'
import React, { useEffect, useState } from 'react';

interface Post {
  Id: string;
  Title: string;
  Content: string;
  Link: string;
  Username: string;
}

const Home: React.FC = () => {
  const [posts, setPosts] = useState<Post[]>([]);

  useEffect(() => {
    
    const fetchPosts = async () => {
      const token = localStorage.getItem('token');
      console.log(token)
      if (!token) return;

      const response = await fetch('https://study-sphere-b.vercel.app/api/posts', {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });

      console.log("hellow")
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
    <div className='mt-20 '>
      <h1 className="text-2xl font-bold mb-4 text-neutral-300">Your Posts</h1>
      {posts.length === 0 ? (
        <p className='text-neutral-200'>No posts found.</p>
      ) : (
        posts.map(post => (
          <div key={post.Id} className="border p-4 mb-4 rounded bg-[url('https://images.pexels.com/photos/8947671/pexels-photo-8947671.jpeg?auto=compress&cs=tinysrgb&w=400')] bg-cover">
            <h2 className="text-xl font-bold text-black">{post.Title}</h2>
            <p>{post.Content}</p>
            <a href={post.Link} target="_blank" rel="noopener noreferrer">Link: {post.Link}</a>
            <p className="text-sm text-gray-800">Posted by: {post.Username}</p>
          </div>
        ))
      )}
    </div>
  );
}

export default Home;
