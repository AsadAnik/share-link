"use client";

import React, { useEffect, useState } from "react";
import ContentLayoutWrapper from "@/components/home/ContentLayoutWrapper";
import ProfileImgPicker from "@/components/widgets/ProfileImgPicker";
import FemaleAvatar from "@/assets/img/female-avatar.png";
import { toast } from "react-toastify";
import { useGetLinksQuery, useGetProfileQuery, useUpdateProfileFormMutation, useUpdateProfilePictureMutation } from "@/store";
import useForm from "@/hooks/useForm";
import * as Yup from "yup";

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

const ProfileScreen = (): React.ReactElement => {
    const { data: profileData, isLoading: loadingForProfileData } = useGetProfileQuery();
    const { data: linksData } = useGetLinksQuery();
    const [updateProfilePicture] = useUpdateProfilePictureMutation();
    const [updateProfileForm, { isLoading: isUpdateProfileFormLoading }] = useUpdateProfileFormMutation();
    const [imageSrc, setImageSrc] = useState<string>('');
    const [links, setLinks] = useState<LinkData[]>(demoLinks);

    // Validation schema for form fields
    const validationSchema = Yup.object().shape({
        fname: Yup.string()
            .required("First name is required.")
            .matches(/^[a-zA-Z]+$/, "First name can only contain letters."),
        lname: Yup.string()
            .required("Last name is required.")
            .matches(/^[a-zA-Z]+$/, "Last name can only contain letters."),
        email: Yup.string()
            .required("Email is required.")
            .email("Email is not valid."),
    });

    // Using the useForm hook for form handling
    const formik = useForm({
        initialValues: {
            fname: '',
            lname: '',
            email: '',
        },
        validationSchema,
        onSubmit: async (values) => {
            try {
                await updateProfileForm(values);
                toast.success("Profile updated successfully.");
            } catch (error) {
                toast.error("Error updating profile.");
            }
        },
    });

    // Sync Links Data
    useEffect(() => {
        if (linksData && linksData.length > 0) {
            setLinks(linksData);
        } else {
            setLinks(demoLinks);
        }
    }, [linksData]);

    // Sync Profile Data
    useEffect(() => {
        if (loadingForProfileData) {
            formik.setValues({
                fname: "Fetching...",
                lname: "Fetching...",
                email: "Fetching...",
            });
        }

        if (!loadingForProfileData && profileData) {
            formik.setValues({
                fname: profileData?.fname || '',
                lname: profileData?.lname || '',
                email: profileData?.email || '',
            });

            if (profileData.photoUrl) {
                setImageSrc(profileData.photoUrl ?? FemaleAvatar.src);
            }
        }
    }, [profileData, loadingForProfileData]);

    return (
        <ContentLayoutWrapper
            links={links}
            title="Profile Details"
            subTitle="Add your details to create a personal touch to your profile."
            handleOnSave={formik.handleSubmit}
            isSaveProcess={isUpdateProfileFormLoading}
        >
            <div className="container grid grid-cols-1 gap-4">
                <div className="flex flex-row gap-4 justify-between items-center bg-gray-50 p-8 rounded-lg shadow-md w-full mx-auto">
                    <label htmlFor="#" className="text-sm text-gray-500">Profile picture</label>

                    <ProfileImgPicker
                        imageSrc={imageSrc}
                        setImageSrc={setImageSrc}
                        sendFileTOServer={updateProfilePicture}
                    />

                    <p className="text-xs text-gray-500">
                        Image must be below 1024x1024px.
                        <br />
                        Use PNG or JPG format.
                    </p>
                </div>

                <div className="bg-gray-50 p-8 rounded-lg shadow-md w-full mx-auto">
                    <div className="space-y-4">
                        {/* First Name Field */}
                        <div>
                            <label
                                htmlFor="fname"
                                className="block text-gray-600 font-medium"
                            >
                                First name<span className="text-red-500">*</span>
                            </label>

                            <input
                                type="text"
                                id="fname"
                                name="fname"
                                className={`w-full p-3 rounded-md border ${formik.touched.fname && formik.errors.fname ? 'border-red-500' : 'border-gray-300'} focus:ring-2 focus:ring-purple-500 focus:outline-none shadow-sm`}
                                placeholder="Ben"
                                value={formik.values.fname}
                                onChange={formik.handleChange}
                                onBlur={formik.handleBlur}
                            />

                            {formik.touched.fname && formik.errors.fname && (
                                <p className="text-red-500 text-xs mt-1">{formik.errors.fname}</p>
                            )}
                        </div>

                        {/* Last Name Field */}
                        <div>
                            <label
                                htmlFor="lname"
                                className="block text-gray-600 font-medium"
                            >
                                Last name<span className="text-red-500">*</span>
                            </label>

                            <input
                                type="text"
                                id="lname"
                                name="lname"
                                className={`w-full p-3 rounded-md border ${formik.touched.lname && formik.errors.lname ? 'border-red-500' : 'border-gray-300'} focus:ring-2 focus:ring-purple-500 focus:outline-none shadow-sm`}
                                placeholder="Wright"
                                value={formik.values.lname}
                                onChange={formik.handleChange}
                                onBlur={formik.handleBlur}
                            />

                            {formik.touched.lname && formik.errors.lname && (
                                <p className="text-red-500 text-xs mt-1">{formik.errors.lname}</p>
                            )}
                        </div>

                        {/* Email Field */}
                        <div>
                            <label
                                htmlFor="email"
                                className="block text-gray-600 font-medium"
                            >
                                Email<span className="text-red-500">*</span>
                            </label>

                            <input
                                type="email"
                                id="email"
                                name="email"
                                className={`w-full p-3 rounded-md border ${formik.touched.email && formik.errors.email ? 'border-red-500' : 'border-gray-300'} focus:ring-2 focus:ring-purple-500 focus:outline-none shadow-sm`}
                                placeholder="benwright@example.com"
                                value={formik.values.email}
                                onChange={formik.handleChange}
                                onBlur={formik.handleBlur}
                            />

                            {formik.touched.email && formik.errors.email && (
                                <p className="text-red-500 text-xs mt-1">{formik.errors.email}</p>
                            )}
                        </div>
                    </div>
                </div>
            </div>
        </ContentLayoutWrapper>
    );
};
export default ProfileScreen;
