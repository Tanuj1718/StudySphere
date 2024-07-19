import { Link } from 'react-router-dom';

function Navbar() {
  return (
    <nav className="flex justify-between items-center py-4">
      <div className="text-2xl font-bold">My App</div>
      <div>
        <Link to="/posts" className="px-4">All Posts</Link>
        <Link to="/post" className="px-4">Create Post</Link>
        <Link to="/login" className="px-4">Login</Link>
        <Link to="/signup" className="px-4">Signup</Link>
      </div>
    </nav>
  );
}

export default Navbar;
