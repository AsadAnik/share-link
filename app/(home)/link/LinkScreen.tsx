'use client';

// pages/links.tsx
import { useState } from 'react';

interface LinkData {
  id: number;
  platform: string;
  url: string;
}

const LinksPage = () => {
  const [links, setLinks] = useState<LinkData[]>([
    { id: 1, platform: 'GitHub', url: 'https://www.github.com/benwright' },
    { id: 2, platform: 'YouTube', url: 'https://www.youtube.com/benwright' },
    { id: 3, platform: 'LinkedIn', url: 'https://www.linkedin.com/in/benwright' },
  ]);

  const addLink = () => {
    setLinks([...links, { id: links.length + 1, platform: '', url: '' }]);
  };

  const updateLink = (id: number, platform: string, url: string) => {
    setLinks(
      links.map((link) =>
        link.id === id ? { ...link, platform, url } : link
      )
    );
  };

  const removeLink = (id: number) => {
    setLinks(links.filter((link) => link.id !== id));
  };

  return (
    <div className="min-h-screen bg-gray-100 flex justify-around pt-5 items-start">
      <div className="rounded-lg w-full max-w-5xl">
        <div className="flex space-x-5">
          {/* Left side mockup (mobile preview) */}
          <div className="rounded-lg w-64 p-4 bg-white shadow-lg">
            <div className="bg-gray-200 h-32 rounded-full mb-4"></div>
            {links.map((link) => (
              <div key={link.id} className={`flex items-center space-x-3 mb-3 rounded-lg p-2 
                ${link.platform === 'GitHub' ? 'bg-black text-white' : ''}
                ${link.platform === 'YouTube' ? 'bg-red-500 text-white' : ''}
                ${link.platform === 'LinkedIn' ? 'bg-blue-600 text-white' : ''}`}>
                <span>{link.platform}</span>
              </div>
            ))}
          </div>

          {/* Right side (form inputs) */}
          <div className="flex-grow bg-white shadow-lg p-4">
            <div className="grid mb-6 gap-2">
              <h1 className="text-2xl font-bold">Customize your links</h1>
              <p className='text-gray-500 text-sm font-thin'>
                Add/edit/remove links below and then share all your profiles with the world!
              </p>

              <button
                className="text-[#7860df] border border-[#7860df] px-4 py-2 rounded-lg font-thin text-sm mb-4"
                onClick={addLink}
              >
                + Add new link
              </button>
            </div>

            {links.map((link) => (
              <div key={link.id} className="mb-6">
                <div className="flex items-center space-x-3">
                  <label htmlFor={`platform-${link.id}`} className="font-semibold">Platform</label>
                  <select
                    id={`platform-${link.id}`}
                    value={link.platform}
                    onChange={(e) => updateLink(link.id, e.target.value, link.url)}
                    className="border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-400">
                    <option value="">Select Platform</option>
                    <option value="GitHub">GitHub</option>
                    <option value="YouTube">YouTube</option>
                    <option value="LinkedIn">LinkedIn</option>
                    {/* Add more options as needed */}
                  </select>

                  <button
                    className="text-red-500 hover:text-red-700"
                    onClick={() => removeLink(link.id)}>
                    Remove
                  </button>
                </div>

                <div className="mt-3">
                  <label htmlFor={`url-${link.id}`} className="block font-semibold mb-1">
                    Link
                  </label>
                  <input
                    type="text"
                    id={`url-${link.id}`}
                    value={link.url}
                    onChange={(e) => updateLink(link.id, link.platform, e.target.value)}
                    className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-400"
                    placeholder="https://example.com"
                  />
                </div>
              </div>
            ))}

            <button className="bg-blue-500 text-white px-6 py-2 rounded-lg mt-6">Save</button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default LinksPage;
