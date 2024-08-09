'use client'
import { useState, FormEvent, ChangeEvent } from 'react';
import { useRouter } from 'next/router';



const CreatePost: React.FC = () => {
  const [title, setTitle] = useState<string>('');
  const [link, setLink] = useState<string>('');
  const [content, setContent] = useState<string>('');
  const router = useRouter();

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();

    const post = { title, link, content };
    const token = localStorage.getItem('token');

    const response = await fetch('https://study-sphere-b.vercel.app/api/post', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`
      },
      body: JSON.stringify(post)
    });

    if (response.ok) {
      router.push('/posts');
    } else {
      console.error('Failed to create post');
    }
  };

  const handleChange = (setter: React.Dispatch<React.SetStateAction<string>>) => (
    e: ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    setter(e.target.value);
  };

  return (
    <div className='mt-20'>
      <h1 className="text-2xl font-bold mb-4 text-neutral-200 ">Create a New Post</h1>
      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label className="block text-sm font-medium text-neutral-200">Title</label>
          <input
            type="text"
            className="mt-1 block w-full border rounded p-2 bg-neutral-300"
            value={title}
            onChange={handleChange(setTitle)}
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-neutral-200">Link</label>
          <input
            type="text"
            className="mt-1 block w-full border rounded p-2 bg-neutral-300"
            value={link}
            onChange={handleChange(setLink)}
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-neutral-200">Content</label>
          <textarea
            className="mt-1 block w-full border rounded p-2 bg-neutral-300"
            value={content}
            onChange={handleChange(setContent)}
          ></textarea>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 w-full  max-w-7xl mx-auto gap-10">
        {buttons.map((button, idx) => (
            <div className='text-neutral-300'>{button.component}</div>
        ))}
      </div>
      </form>
    </div>
  );
};

export const buttons = [
{
  name: "Shimmer",
  description: "Shimmer button for your website",
  showDot: false,
  component: (
    <button className="inline-flex h-12 animate-shimmer items-center justify-center rounded-md border border-slate-800 bg-[linear-gradient(110deg,#000103,45%,#1e2631,55%,#000103)] bg-[length:200%_100%] px-6 font-medium text-slate-400 transition-colors focus:outline-none focus:ring-2 focus:ring-slate-400 focus:ring-offset-2 focus:ring-offset-slate-50" type='submit'>
      Create Post
    </button>
  ),
}]

export default CreatePost;
