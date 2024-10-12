"use client";

import { useState, useEffect } from "react";
import { DragDropContext, Droppable, Draggable } from "react-beautiful-dnd";
import { HiOutlineMenuAlt4 } from "react-icons/hi";
import ContentLayoutWrapper from "@/components/home/ContentLayoutWrapper";
import { useGetLinksQuery, useCreateLinkMutation } from '@/store';

interface LinkData {
  id: string;
  platform: string;
  url: string;
}

const demoLinks = [
  { id: '1', platform: "GitHub", url: "https://www.github.com/benwright" },
  { id: '2', platform: "YouTube", url: "https://www.youtube.com/benwright" },
  { id: '3', platform: "LinkedIn", url: "https://www.linkedin.com/in/benwright" },
];

const LinksPage = () => {
  const { data: linksData } = useGetLinksQuery();
  const [createLinkMutation, createdLinksResult] = useCreateLinkMutation();
  const [links, setLinks] = useState<LinkData[]>(demoLinks);

  // region Links Data Sync
  useEffect(() => {
    if (linksData && linksData.length > 0) {
      setLinks(linksData);
    } else {
      setLinks(demoLinks);
    }
  }, [linksData]);

  const addLink = () => {
    setLinks([...links, { id: (links.length + 1).toString(), platform: "", url: "" }]);
  };

  const updateLink = (id: string, platform: string, url: string) => {
    setLinks(links.map(link => (link.id === id ? { ...link, platform, url } : link)));
  };

  const removeLink = (id: string) => {
    setLinks(links.filter(link => link.id !== id));
  };

  // region On Drag End
  const onDragEnd = (result: any) => {

    console.log('This is on Drag Feature here -- ', result);

    if (!result.destination) return;
    const newLinks = Array.from(links);
    const [reorderedLink] = newLinks.splice(result.source.index, 1);
    newLinks.splice(result.destination.index, 0, reorderedLink);
    setLinks(newLinks);
  };

  // region Save Link to Server
  const handleSaveLinkToServer = async () => {
    try {
      await createLinkMutation(links).unwrap();
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
      <DragDropContext onDragEnd={onDragEnd}>
        <Droppable droppableId="links-list">
          {(provided) => (
            <div
              {...provided.droppableProps}
              ref={provided.innerRef}
              className="space-y-4"
            >
              {links.map((link, index) => (
                <Draggable key={link.id} draggableId={link.id} index={index}>
                  {(provided) => (
                    <div
                      ref={provided.innerRef}
                      {...provided.draggableProps}
                      {...provided.dragHandleProps}
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
                        <label htmlFor={`platform-${link.id}`} className="block text-sm font-medium text-gray-600">Platform</label>
                        <select
                          id={`platform-${link.id}`}
                          value={link.platform}
                          onChange={(e) => updateLink(link.id, e.target.value, link.url)}
                          className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring focus:ring-blue-300"
                        >
                          <option value="">Select Platform</option>
                          <option value="GitHub">GitHub</option>
                          <option value="YouTube">YouTube</option>
                          <option value="LinkedIn">LinkedIn</option>
                        </select>
                      </div>

                      <div>
                        <label htmlFor={`url-${link.id}`} className="block text-sm font-medium text-gray-600">Link</label>
                        <input
                          type="text"
                          id={`url-${link.id}`}
                          value={link.url}
                          onChange={(e) => updateLink(link.id, link.platform, e.target.value)}
                          className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring focus:ring-blue-300"
                          placeholder="https://example.com"
                        />
                      </div>
                    </div>
                  )}
                </Draggable>
              ))}
              {provided.placeholder}
            </div>
          )}
        </Droppable>
      </DragDropContext>
    </ContentLayoutWrapper>
  );
};

export default LinksPage;
