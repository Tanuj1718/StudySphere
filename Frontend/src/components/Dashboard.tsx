'use client'
import React, { useEffect, useState } from 'react';
import Navbar from './Navbar';

interface User {
    id: number;
    name: string;
}

const UserList: React.FC = () => {
    const [users, setUsers] = useState<User[]>([]);
    const [loading, setLoading] = useState<boolean>(true);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        const fetchUsers = async () => {
            try {
                const response = await fetch('https://study-sphere-b.vercel.app/');
                if (response.ok) {
                    const data: User[] = await response.json();
                    setUsers(data);
                } else {
                    throw new Error('Failed to fetch users');
                }
            } catch (err: any) {
                setError(err.message);
            } finally {
                setLoading(false);
            }
        };

        fetchUsers();
    }, []);

    if (loading) {
        return <div>Loading...</div>;
    }

    if (error) {
        return <div>Error: {error}</div>;
    }

    return (
        <div className="h-auto flex items-center justify-center bg-transparent z-50 mt-[100px]">
            <Navbar/>
            <div className="bg-transparent p-8 rounded shadow-md w-full max-w-md z-50">
                <h2 className="text-2xl font-bold mb-6 text-center text-blue-100 z-50 text-nowrap">Registered Users</h2>
                <ul className="space-y-4 z-50">
                    {users.map((user, index) => (
                        <li key={index} className="p-4 border rounded-lg text-blue-200 z-50">
                            {user}
                        </li>
                    ))}
                </ul>
            </div>
        </div>
    );
};

export default UserList;
