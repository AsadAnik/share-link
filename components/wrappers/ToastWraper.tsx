'use client';

import { useRouter } from 'next/navigation';
import { toast } from 'react-toastify';

interface IToastMessage {
    type?: string;
    title?: string;
    message?: string;
    options?: any;
    className?: any;
    redirect?: any;
}

export const ToastMessageWrapper = ({
    type,
    title,
    message,
    className,
    redirect,
}: IToastMessage) => {
    const route = useRouter();
    const titleClass = 'text-gray-700 text-md';
    let messageTextClass = 'text-sm';

    switch (type) {
        case 'success':
            messageTextClass = messageTextClass + ' text-green-500';
            break;
        case 'error':
            messageTextClass = messageTextClass + ' text-red-500';
            break;
        case 'warning':
            messageTextClass = messageTextClass + ' text-yellow-500';
            break;
        default:
            messageTextClass = messageTextClass + ' text-gray-800';
    }

    if (redirect) {
        route.push(redirect);
    }

    return (
        <div className={className}>
            {title && <h5 className={` ${titleClass}`}>{title}</h5>}
            {message && (
                <p
                    className={messageTextClass}
                    dangerouslySetInnerHTML={{ __html: message }}
                ></p>
            )}
        </div>
    );
};

export const ToastSuccessMessage = ({
    title,
    message,
    options,
    redirect,
}: IToastMessage) => {
    toast.success(
        <ToastMessageWrapper
            type="success"
            title={title}
            message={message}
            redirect={redirect}
        />,
        options,
    );
};

export const ToastErrorMessage = ({
    title,
    message,
    options,
    redirect,
}: IToastMessage) => {
    toast.error(
        <ToastMessageWrapper
            type="error"
            title={title}
            message={message}
            redirect={redirect}
        />,
        options,
    );
};

export const ToastWarningMessage = ({
    title,
    message,
    options,
    redirect,
}: IToastMessage) => {
    toast.warning(
        <ToastMessageWrapper
            type="warning"
            title={title}
            message={message}
            redirect={redirect}
        />,
        options,
    );
};

export const ToastMessage = ({
    type,
    title,
    message,
    options,
    redirect,
}: IToastMessage) => {
    switch (type) {
        case 'success':
            ToastSuccessMessage({ title, message, options, redirect });
            break;
        case 'error':
            ToastErrorMessage({ title, message, options, redirect });
            break;
        case 'warning':
            ToastWarningMessage({ title, message, options, redirect });
            break;
        default:
            toast(
                <ToastMessageWrapper
                    title={title}
                    message={message}
                    redirect={redirect}
                />,
                {
                    type,
                    position: 'top-center',
                    ...options,
                },
            );
    }
};
