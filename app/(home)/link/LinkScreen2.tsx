"use client";

import { useState } from "react";
import { DragDropContext, Droppable, Draggable } from "react-beautiful-dnd";
import { HiOutlineMenuAlt4 } from "react-icons/hi";
import Image from "next/image";
import Phone from "@/assets/img/phone.png";

interface LinkData {
  id: number;
  platform: string;
  url: string;
}

const LinksPage = () => {
  const [links, setLinks] = useState<LinkData[]>([
    { id: 1, platform: "GitHub", url: "https://www.github.com/benwright" },
    { id: 2, platform: "YouTube", url: "https://www.youtube.com/benwright" },
    { id: 3, platform: "LinkedIn", url: "https://www.linkedin.com/in/benwright" },
  ]);

  const addLink = () => {
    setLinks([...links, { id: links.length + 1, platform: "", url: "" }]);
  };

  const updateLink = (id: number, platform: string, url: string) => {
    setLinks(links.map(link => (link.id === id ? { ...link, platform, url } : link)));
  };

  const removeLink = (id: number) => {
    setLinks(links.filter(link => link.id !== id));
  };

  const onDragEnd = (result: any) => {
    if (!result.destination) return;

    const newLinks = [...links];
    const [reorderedLink] = newLinks.splice(result.source.index, 1);
    newLinks.splice(result.destination.index, 0, reorderedLink);

    setLinks(newLinks);
  };

  return (
    <div className="content-wrapper">
      <section className="left-content">
        <div className="phone-container relative">
          <Image src={Phone} alt="Phone" className="phone-img" />
          <div className="absolute top-10 left-5 w-11/12 h-full phone-contents">
            <div className="bg-gray-200 mb-4 avatar-circle"></div>
            <div className="bg-gray-200 mb-4 title-email-name"></div>
            {links.map(link => (
              <div
                key={link.id}
                className={`flex items-center space-x-3 mb-3 rounded-lg p-2
                  ${link.platform === "GitHub" ? "bg-black text-white" : ""}
                  ${link.platform === "YouTube" ? "bg-red-500 text-white" : ""}
                  ${link.platform === "LinkedIn" ? "bg-blue-600 text-white" : ""}`}
              >
                <span>{link.platform}</span>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="right-content">
        <div className="grid mb-5 gap-2 mt-4 ml-2 mr-2">
          <h1 className="text-2xl font-bold">Customize your links</h1>
          <p className="text-gray-500 text-sm font-thin">
            Add/edit/remove links below and then share all your profiles with the world!
          </p>

          <button
            className="text-[#7860df] border border-[#7860df] px-4 py-2 rounded-lg font-thin text-sm mt-5"
            onClick={addLink}
          >
            + Add new link
          </button>
        </div>

        <DragDropContext onDragEnd={onDragEnd}>
          <Droppable droppableId="links-list">
            {(provided) => (
              <div {...provided.droppableProps} ref={provided.innerRef}>
                {links.map((link, index) => (
                  <Draggable key={link.id} draggableId={link.id.toString()} index={index}>
                    {(provided) => (
                      <div
                        ref={provided.innerRef}
                        {...provided.draggableProps}
                        {...provided.dragHandleProps}
                        className="link-content mb-4 ml-3 mr-3"
                      >
                        <div className="link-head space-x-3 text-sm">
                          <div className="flex items-center space-x-3">
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

        <hr />

        <div className="flex w-full containers mx-auto items-center justify-end mt-5 mr-2">
          <button className="bg-[#7860df] text-white px-4 py-2 rounded-lg font-thin text-sm flex-end">
            Save
          </button>
        </div>
      </section>
    </div>
  );
};

export default LinksPage;
