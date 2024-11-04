"use client";
import { useState, useEffect } from "react";
import { HiOutlineMenuAlt4 } from "react-icons/hi";
import ContentLayoutWrapper from "@/components/home/ContentLayoutWrapper";
import { useGetLinksQuery, useCreateLinkMutation } from "@/store";

interface LinkData {
  id: string;
  platform: string;
  url: string;
  isValid?: boolean;
}

const demoLinks: LinkData[] = [
  {
    id: "1",
    platform: "GitHub",
    url: "https://www.github.com/benwright",
    isValid: true,
  },
  {
    id: "2",
    platform: "YouTube",
    url: "https://www.youtube.com/benwright",
    isValid: true,
  },
  {
    id: "3",
    platform: "LinkedIn",
    url: "https://www.linkedin.com/in/benwright",
    isValid: true,
  },
];

const platformsConfig: { [key: string]: { name: string; regex: RegExp } } = {
  GitHub: {
    name: "GitHub",
    regex:
      /^https:\/\/(www\.)?github\.com\/(?!.*\.git$)[A-Za-z0-9_-]+(\/.*)?$/i,
  },
  LinkedIn: {
    name: "LinkedIn",
    regex:
      /^https:\/\/(www\.)?linkedin\.com\/(in|pub|company|school)\/[A-Za-z0-9_-]+\/?$/i,
  },
  YouTube: {
    name: "YouTube",
    regex:
      /^https:\/\/(www\.)?youtube\.com\/(@[A-Za-z0-9_-]+|c\/[A-Za-z0-9_-]+|channel\/[A-Za-z0-9_-]+|user\/[A-Za-z0-9_-]+|watch\?v=[\w-]+)$/i,
  },
};

const LinksPage = () => {
  const { data: linksData } = useGetLinksQuery();
  const [createLinkMutation, createdLinksResult] = useCreateLinkMutation();
  const [links, setLinks] = useState<LinkData[]>(demoLinks);
  const [draggingLinkId, setDraggingLinkId] = useState<string | null>(null);

  useEffect(() => {
    if (linksData && linksData.length > 0) {
      setLinks(linksData.map((link) => ({ ...link, isValid: true })));
    } else {
      setLinks(demoLinks);
    }
  }, [linksData]);

  const addLink = () => {
    setLinks([
      ...links,
      {
        id: (links.length + 1).toString(),
        platform: "",
        url: "",
        isValid: true,
      },
    ]);
  };

  const updateLink = (id: string, platform: string, url: string) => {
    const isValid = validateLink(platform, url);
    setLinks(
      links.map((link) =>
        link.id === id ? { ...link, platform, url, isValid } : link
      )
    );
  };

  const removeLink = (id: string) => {
    setLinks(links.filter((link) => link.id !== id));
  };

  const validateLink = (platform: string, url: string): boolean => {
    const platformConfig = platformsConfig[platform];
    return platformConfig ? platformConfig.regex.test(url) : true;
  };

  // Custom drag-and-drop handlers
  const handleDragStart = (id: string) => {
    setDraggingLinkId(id);
  };

  const handleDragEnter = (enterId: string) => {
    if (draggingLinkId === enterId) return;

    const newLinks = [...links];
    const draggingIndex = newLinks.findIndex(
      (link) => link.id === draggingLinkId
    );
    const enterIndex = newLinks.findIndex((link) => link.id === enterId);

    // Swap the positions
    [newLinks[draggingIndex], newLinks[enterIndex]] = [
      newLinks[enterIndex],
      newLinks[draggingIndex],
    ];

    setLinks(newLinks);
  };

  const handleDragEnd = () => {
    setDraggingLinkId(null);
  };

  const handleDragOver = (event: React.DragEvent) => {
    event.preventDefault(); // Needed to allow the drop event to work
  };

  const handleDrop = () => {
    setDraggingLinkId(null); // Reset dragging state
  };

  const handleSaveLinkToServer = async () => {
    try {
      await createLinkMutation(links).unwrap();
      setLinks(links.map((link) => ({ ...link, isValid: true })));
    } catch (error) {
      console.error("Error saving links:", error);
    }
  };

  return (
    <ContentLayoutWrapper
      links={links}
      title="Customize your links"
      subTitle="Add/edit/remove links below and then share all your profiles with the world!"
      addLink={addLink}
      handleOnSave={handleSaveLinkToServer}
      isSaveProcess={createdLinksResult.isLoading}
    >
      <div className="space-y-4">
        {links.map((link, index) => (
          <div
            key={link.id}
            draggable
            onDragStart={() => handleDragStart(link.id)}
            onDragEnter={() => handleDragEnter(link.id)}
            onDragEnd={handleDragEnd}
            onDragOver={handleDragOver}
            onDrop={handleDrop}
            className="p-4 bg-white border border-gray-200 rounded-lg shadow-md transition hover:shadow-lg"
          >
            <div className="flex justify-between mb-2">
              <div className="flex items-center space-x-2">
                <HiOutlineMenuAlt4 />
                <h3 className="font-bold text-gray-700">Link #{index + 1}</h3>
              </div>
              <button
                className="text-gray-500 hover:text-red-600"
                onClick={() => removeLink(link.id)}
              >
                Remove
              </button>
            </div>

            <div className="mb-3">
              <label
                htmlFor={`platform-${link.id}`}
                className="block text-sm font-medium text-gray-600"
              >
                Platform
              </label>
              <select
                id={`platform-${link.id}`}
                value={link.platform}
                onChange={(e) => updateLink(link.id, e.target.value, link.url)}
                className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring focus:ring-blue-300"
              >
                <option value="">Select Platform</option>
                {Object.keys(platformsConfig).map((platformKey) => (
                  <option key={platformKey} value={platformKey}>
                    {platformsConfig[platformKey].name}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label
                htmlFor={`url-${link.id}`}
                className="block text-sm font-medium text-gray-600"
              >
                Link
              </label>
              <input
                type="text"
                id={`url-${link.id}`}
                value={link.url}
                onChange={(e) =>
                  updateLink(link.id, link.platform, e.target.value)
                }
                className={`w-full border ${
                  link.isValid ? "border-gray-300" : "border-red-500"
                } rounded-lg px-3 py-2 focus:outline-none focus:ring focus:ring-blue-300`}
                placeholder="https://example.com"
              />
              {!link.isValid && (
                <p className="text-red-500 text-xs mt-1">
                  Invalid URL for {platformsConfig[link.platform]?.name}
                </p>
              )}
            </div>
          </div>
        ))}
      </div>
    </ContentLayoutWrapper>
  );
};

export default LinksPage;
