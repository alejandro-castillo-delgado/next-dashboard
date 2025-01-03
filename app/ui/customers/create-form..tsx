'use client';

import { CustomerField } from '@/app/lib/definitions';
import Link from 'next/link';
import { Button } from '../button';
import { createCustomer, StateCustomer } from '@/app/lib/actions';
import { useActionState, useState } from 'react';
import ImageUpload from './upload';
import { useDropzone } from 'react-dropzone';

export default function CustomerForm() {

    const initialState: StateCustomer = { message: null, error: {} };
    const [state, formAction] = useActionState(createCustomer, initialState);


    const [selectedImage, setSelectedImage] = useState(null);

    const onDrop = (acceptedFiles: any) => {
        setSelectedImage(acceptedFiles[0]);
    }

    const { getRootProps, getInputProps } = useDropzone({
        onDrop,
        accept: {
            'image/*': [],
        },
    })

    // const handleSubmit = (events: any) => {
    //     const formData = new FormData(events.target);
    //     formData.append('image', selectedImage);
    //     //formAction(formData);
    //     console.log(formData);
    // }
    return (
        <form action={formAction}>
            <div className='rounded-md bg-gray-50 p-4 md:p-6 block'>
                <div className="mb-4">
                    <label htmlFor="name" className="mb-2 block text-sm font-medium">
                        Input an name
                    </label>
                    <div className="relative mt-2 rounded-md">
                        <div className="relative">
                            <input
                                id="name"
                                name="name"
                                type="text"
                                placeholder="Enter Name"
                                className="peer block w-full rounded-md border border-gray-200 py-2 pl-10 text-sm outline-2 placeholder:text-gray-500"
                                aria-describedby='name-error'
                            />
                        </div>
                    </div>
                    <div id='name-error' aria-live='polite' aria-atomic='true'>
                        {state.error?.name && state.error.name.map((error: string) => (
                            <p className='mt-2 text-sm text-red-500' key={error}>
                                {error}
                            </p>
                        ))}
                    </div>
                </div>
                <div className="mb-4">
                    <label htmlFor="email" className="mb-2 block text-sm font-medium">
                        Input an email
                    </label>
                    <div className="relative mt-2 rounded-md">
                        <div className="relative">
                            <input
                                id="email"
                                name="email"
                                type="email"
                                placeholder="Enter Email"
                                className="peer block w-full rounded-md border border-gray-200 py-2 pl-10 text-sm outline-2 placeholder:text-gray-500"
                                aria-describedby='name-error'
                            />
                        </div>
                    </div>
                    <div id='name-error' aria-live='polite' aria-atomic='true'>
                        {state.error?.email && state.error.email.map((error: string) => (
                            <p className='mt-2 text-sm text-red-500' key={error}>
                                {error}
                            </p>
                        ))}
                    </div>
                </div>
                <div className='h-10 w-full block text-center'>
                    {/* <input type='file' name='image' className='' accept='image/*' id='image' /> */}
                    <div {...getRootProps()}>
                        <input name='image' {...getInputProps()} />
                        <p>Arrastra y suelta una imagen aquí, o haz clic para seleccionar.</p>
                        {selectedImage && <img src={URL.createObjectURL(selectedImage)} alt="Preview" />}
                    </div>
                </div>
                <button className='bg-blue-500 rounded-lg py-2 px-4 text-white font-bold' type='submit'>Subir</button>
            </div>
        </form>
    );
}