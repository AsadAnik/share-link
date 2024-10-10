"use client";

import { useState } from "react";
import { DragDropContext, Droppable, Draggable } from "react-beautiful-dnd";
import { HiOutlineMenuAlt4 } from "react-icons/hi";
import ContentLayoutWrapper from "@/components/home/ContentLayoutWrapper";

interface LinkData {
  id: string;
  platform: string;
  url: string;
}

const LinksPage = () => {
  const [links, setLinks] = useState<LinkData[]>([
    { id: '1', platform: "GitHub", url: "https://www.github.com/benwright" },
    { id: '2', platform: "YouTube", url: "https://www.youtube.com/benwright" },
    { id: '3', platform: "LinkedIn", url: "https://www.linkedin.com/in/benwright" },
  ]);

  const addLink = () => {
    setLinks([...links, { id: (links.length + 1).toString(), platform: "", url: "" }]);
  };

  const updateLink = (id: string, platform: string, url: string) => {
    setLinks(links.map(link => (link.id === id.toString() ? { ...link, platform, url } : link)));
  };

  const removeLink = (id: string) => {
    setLinks(links.filter(link => link.id !== id.toString()));
  };

  const onDragEnd = (result: any) => {
    if (!result.destination) return;

    console.log('DRAG END RESULT -- ', result);

    const newLinks = [...links];
    const [reorderedLink] = newLinks.splice(result.source.index, 1);
    newLinks.splice(result.destination.index, 0, reorderedLink);

    setLinks(newLinks);
  };

  return (
    <ContentLayoutWrapper 
      links={links} 
      title="Customize your links" 
      subTitle="Add/edit/remove links below and then share all your profiles with the world!"
      addLink={addLink}
    >
      <DragDropContext onDragEnd={onDragEnd}>
        <Droppable droppableId="links-list">
          {(provided) => (
            <div {...provided.droppableProps} ref={provided.innerRef}>
              {links.map((link, index) => (
                <Draggable key={link.id} draggableId={link.id.toString()} index={index}>
                  {(provided) => (
                    <div
                      ref={provided.innerRef}
                      {...provided.draggableProps} // Apply draggableProps to the container
                      className="link-content mb-4 ml-3 mr-3"
                    >
                      <div className="link-head space-x-3 text-sm">
                        <div
                          className="flex items-center space-x-3"
                          {...provided.dragHandleProps} // Apply dragHandleProps to make this the drag handle
                        >
                          <HiOutlineMenuAlt4 />
                          <h3 className="font-extrabold text-gray-500">Link #{index + 1}</h3>
                        </div>

                        <div className="flex items-center space-x-3">
                          <button
                            className="text-gray-500 hover:text-red-700"
                            onClick={() => removeLink(link.id)}
                          >
                            Remove
                          </button>
                        </div>
                      </div>

                      <div className="link-body">
                        <label
                          htmlFor={`platform-${link.id}`}
                          className="font-normal text-gray-600 text-xs"
                        >
                          Platform
                        </label>
                        <select
                          id={`platform-${link.id}`}
                          value={link.platform}
                          onChange={(e) => updateLink(link.id, e.target.value, link.url)}
                          className="link-selector"
                        >
                          <option value="">Select Platform</option>
                          <option value="GitHub">GitHub</option>
                          <option value="YouTube">YouTube</option>
                          <option value="LinkedIn">LinkedIn</option>
                        </select>
                      </div>

                      <div className="link-body">
                        <label
                          htmlFor={`url-${link.id}`}
                          className="font-normal text-gray-600 text-xs"
                        >
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
