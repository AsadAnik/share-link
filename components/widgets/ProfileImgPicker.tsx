import { useRef } from "react";
import { HiCamera } from "react-icons/hi";
import Image from "next/image";

interface ProfileImagePickerProps {
    imageSrc: string;
    setImageSrc: (src: string) => void;
}

const ProfileImagePicker = ({ imageSrc, setImageSrc }: ProfileImagePickerProps) => {
    const fileInputRef = useRef<HTMLInputElement | null>(null);

    // region Handle Change
    const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        if (e.target.files && e.target.files[0]) {
            const file = e.target.files[0];
            const reader = new FileReader();

            reader.onload = () => {
                setImageSrc(reader.result as string);
            };

            reader.readAsDataURL(file);
        }
    };

    // region Trigger File Select
    // Function to trigger the file input click
    const triggerFileSelect = () => {
        if (fileInputRef.current) {
            fileInputRef.current.click();
        }
    };

    return (
        <div className="relative group w-[150px] h-[150px] rounded overflow-hidden">
            <Image
                src={imageSrc}
                alt="Profile Image"
                className="w-full h-full object-cover rounded"
                width={150}
                height={150}
            />

            <input
                type="file"
                accept="image/*"
                ref={fileInputRef}
                onChange={handleImageChange}
                className="hidden"
            />

            <div
                className="absolute inset-0 bg-black bg-opacity-50 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-300 cursor-pointer"
                onClick={triggerFileSelect}
            >
                <div className="text-center text-white">
                    <HiCamera className="w-8 h-8 mx-auto" />
                    <span className="block text-sm mt-2">Change Photo</span>
                </div>
            </div>
        </div>
    );
};

export default ProfileImagePicker;
