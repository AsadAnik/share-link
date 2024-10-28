// "use client";

// import React, { useState, useEffect } from "react";
// import ContentLayoutWrapper from "@/components/home/ContentLayoutWrapper";
// import ProfileImgPicker from "@/components/widgets/ProfileImgPicker";
// import FemaleAvatar from "@/assets/img/female-avatar.png";
// import { toast } from "react-toastify";
// import { useGetLinksQuery, useGetProfileQuery, useUpdateProfileFormMutation, useUpdateProfilePictureMutation } from "@/store";

// interface LinkData {
//     id: string;
//     platform: string;
//     url: string;
// }

// const demoLinks = [
//     { id: '1', platform: "GitHub", url: "https://www.github.com/benwright" },
//     { id: '2', platform: "YouTube", url: "https://www.youtube.com/benwright" },
//     { id: '3', platform: "LinkedIn", url: "https://www.linkedin.com/in/benwright" },
// ];

// const ProfileScreen = (): React.ReactElement => {
//     const { data: profileData, isLoading: loadingForProfileData } = useGetProfileQuery();
//     const { data: linksData } = useGetLinksQuery();
//     const [updateProfilePicture, updateProfilePictureResult] = useUpdateProfilePictureMutation();
//     const [updateProfileForm, updateProfileFormResult] = useUpdateProfileFormMutation();
//     const [imageSrc, setImageSrc] = useState<string>('');
//     const [profileFormData, setProfileFormData] = useState<any>(profileData || {});
//     const [formErrors, setFormErrors] = useState<any>({
//         fnameError: false,
//         fnameErrorMsg: "",
//         lnameError: false,
//         lnameErrorMsg: "",
//         emailError: false,
//         emailErrorMsg: "",
//     });
//     const [links, setLinks] = useState<LinkData[]>(demoLinks);

//     // region Sync Links Data
//     useEffect(() => {
//         if (linksData && linksData.length > 0) {
//             setLinks(linksData);
//         } else {
//             setLinks(demoLinks);
//         }
//     }, [linksData]);


//     // region Sync Profile Data
//     useEffect(() => {
//         if (loadingForProfileData) {
//             setProfileFormData({
//                 fname: "Fetching...",
//                 lname: "Fetching...",
//                 email: "Fetching...",
//             });
//         }

//         if (loadingForProfileData === false && profileData) {
//             setProfileFormData({
//                 fname: profileData?.fname,
//                 lname: profileData?.lname,
//                 email: profileData?.email,
//             });

//             if (profileData.photoUrl) {
//                 setImageSrc(profileData.photoUrl ?? FemaleAvatar.src);
//             }
//         }
//     }, [profileData, loadingForProfileData]);


//     // Validation rules for form fields
//     // region Validation Rules
//     const validationRules = {
//         fname: {
//             required: true,
//             pattern: /^[a-zA-Z]+$/,
//             errorMsg: "Please enter a valid first name.",
//         },
//         lname: {
//             required: true,
//             pattern: /^[a-zA-Z]+$/,
//             errorMsg: "Please enter a valid last name.",
//         },
//         email: {
//             required: true,
//             pattern: /^[^\s@]+@[^\s@]+\.[^\s@]+$/,
//             errorMsg: "Please enter a valid email address.",
//         },
//     };


//     // Function to validate the form
//     //  region Validation Function
//     const validateForm = (formData: any) => {
//         let valid = true;
//         let errors = { ...formErrors };

//         // First name validation
//         if (!formData.fname || !validationRules.fname.pattern.test(formData.lname)) {
//             errors.fnameError = true;
//             errors.fnameErrorMsg = validationRules.fname.errorMsg;
//             valid = false;
//         } else {
//             errors.fnameError = false;
//             errors.fnameErrorMsg = "";
//         }

//         // Last name validation
//         if (!formData.lname || !validationRules.lname.pattern.test(formData.lname)) {
//             errors.lnameError = true;
//             errors.lnameErrorMsg = validationRules.lname.errorMsg;
//             valid = false;
//         } else {
//             errors.lnameError = false;
//             errors.lnameErrorMsg = "";
//         }

//         // Email validation
//         if (!formData.email || !validationRules.email.pattern.test(formData.email)) {
//             errors.emailError = true;
//             errors.emailErrorMsg = validationRules.email.errorMsg;
//             valid = false;
//         } else {
//             errors.emailError = false;
//             errors.emailErrorMsg = "";
//         }

//         setFormErrors(errors);
//         return valid;
//     };


//     // Function to handle form submission
//     // region Submit Form
//     const handleUpdateSubmit = async () => {
//         const { fname, lname, email } = profileFormData;

//         console.log('This is what we are found to fname lname and email - ', fname, lname, email);

//         // Validate the form data
//         const isValid = validateForm({ fname, lname, email });

//         if (isValid) {
//             try {
//                 // Make an API call to update the profile
//                 await updateProfileForm(profileFormData);
//                 // router.push("/profile");
//             } catch (error) {
//                 toast.error("Error updating profile.");
//             }
//         } else {
//             toast.error("Please fix the errors before submitting.");
//         }
//     };

//     return (
//         <ContentLayoutWrapper
//             links={links}
//             title="Profile Details"
//             subTitle="Add your details to create a personal touch to your profile."
//             handleOnSave={handleUpdateSubmit}
//             isSaveProcess={updateProfileFormResult.isLoading}
//         >
//             <div className="container grid grid-cols-1 gap-4">
//                 <div className="flex flex-row gap-4 justify-between items-center bg-gray-50 p-8 rounded-lg shadow-md w-full mx-auto">
//                     <label htmlFor="#" className="text-sm text-gray-500">Profile picture</label>

//                     <ProfileImgPicker
//                         imageSrc={imageSrc}
//                         setImageSrc={setImageSrc}
//                         sendFileTOServer={updateProfilePicture}
//                     />

//                     <p className="text-xs text-gray-500">
//                         Image must be below 1024x1024px.
//                         <br />
//                         Use PNG or JPG format.
//                     </p>
//                 </div>

//                 <div className="bg-gray-50 p-8 rounded-lg shadow-md w-full mx-auto">
//                     <div className="space-y-4">
//                         {/* First Name Field */}
//                         <div>
//                             <label
//                                 htmlFor="firstName"
//                                 className="block text-gray-600 font-medium"
//                             >
//                                 First name<span className="text-red-500">*</span>
//                             </label>

//                             <input
//                                 type="text"
//                                 id="firstName"
//                                 name="firstName"
//                                 className={`w-full p-3 rounded-md border ${formErrors.fnameError ? 'border-red-500' : 'border-gray-300'} focus:ring-2 focus:ring-purple-500 focus:outline-none shadow-sm`}
//                                 placeholder="Ben"
//                                 value={profileFormData?.fname || ''}
//                                 onChange={(event) => setProfileFormData({ ...profileFormData, fname: event.target.value })}
//                             />

//                             {formErrors.fnameError && (
//                                 <p className="text-red-500 text-xs mt-1">{formErrors.fnameErrorMsg}</p>
//                             )}
//                         </div>

//                         {/* Last Name Field */}
//                         <div>
//                             <label
//                                 htmlFor="lastName"
//                                 className="block text-gray-600 font-medium"
//                             >
//                                 Last name<span className="text-red-500">*</span>
//                             </label>

//                             <input
//                                 type="text"
//                                 id="lastName"
//                                 name="lastName"
//                                 className={`w-full p-3 rounded-md border ${formErrors.lnameError ? 'border-red-500' : 'border-gray-300'} focus:ring-2 focus:ring-purple-500 focus:outline-none shadow-sm`}
//                                 placeholder="Wright"
//                                 value={profileFormData?.lname || ''}
//                                 onChange={(event) => setProfileFormData({ ...profileFormData, lname: event.target.value })}
//                             />

//                             {formErrors.lnameError && (
//                                 <p className="text-red-500 text-xs mt-1">{formErrors.lnameErrorMsg}</p>
//                             )}
//                         </div>

//                         {/* Email Field */}
//                         <div>
//                             <label htmlFor="email" className="block text-gray-600 font-medium">
//                                 Email
//                             </label>

//                             <input
//                                 type="email"
//                                 id="email"
//                                 name="email"
//                                 className={`w-full p-3 rounded-md border ${formErrors.emailError ? 'border-red-500' : 'border-gray-300'} focus:ring-2 focus:ring-purple-500 focus:outline-none shadow-sm`}
//                                 placeholder="ben@example.com"
//                                 value={profileFormData?.email}
//                                 onChange={(event) => setProfileFormData({ ...profileFormData, email: event.target.value })}
//                             />

//                             {formErrors.emailError && (
//                                 <p className="text-red-500 text-xs mt-1">{formErrors.emailErrorMsg}</p>
//                             )}
//                         </div>
//                     </div>

//                 </div>
//             </div>
//         </ContentLayoutWrapper>
//     );
// };

// export default ProfileScreen;


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
