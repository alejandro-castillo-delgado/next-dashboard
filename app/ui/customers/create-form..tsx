'use client';

import { CustomerField } from '@/app/lib/definitions';
import Link from 'next/link';
import { Button } from '../button';
import { createCustomer, StateCustomer } from '@/app/lib/actions';
import { useActionState, useState } from 'react';
import ImageUpload from './upload';
import { useDropzone } from 'react-dropzone';
import Image from 'next/image';

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
                <div className="col-span-full">
                    <label className="block text-sm/6 font-medium text-gray-900">Cover photo</label>
                    <div className="mt-2 flex justify-center rounded-lg border border-dashed border-gray-900/25 px-6 py-10">
                        <div className="text-center">
                            <svg className="mx-auto size-12 text-gray-300" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true" data-slot="icon">
                                <path fill-rule="evenodd" d="M1.5 6a2.25 2.25 0 0 1 2.25-2.25h16.5A2.25 2.25 0 0 1 22.5 6v12a2.25 2.25 0 0 1-2.25 2.25H3.75A2.25 2.25 0 0 1 1.5 18V6ZM3 16.06V18c0 .414.336.75.75.75h16.5A.75.75 0 0 0 21 18v-1.94l-2.69-2.689a1.5 1.5 0 0 0-2.12 0l-.88.879.97.97a.75.75 0 1 1-1.06 1.06l-5.16-5.159a1.5 1.5 0 0 0-2.12 0L3 16.061Zm10.125-7.81a1.125 1.125 0 1 1 2.25 0 1.125 1.125 0 0 1-2.25 0Z" clip-rule="evenodd" />
                            </svg>
                            <div  {...getRootProps({ className: "mt-4 flex text-sm/6 text-gray-600" })} >
                                <label className="relative cursor-pointer rounded-md bg-white font-semibold text-indigo-600 focus-within:outline-none focus-within:ring-2 focus-within:ring-indigo-600 focus-within:ring-offset-2 hover:text-indigo-500">
                                    <span>Upload a file</span>
                                    <input  name='image' {...getInputProps()} />
                                </label>
                                <p className="pl-1">or drag and drop</p>
                            </div>
                            <p className="text-xs/5 text-gray-600">PNG, JPG, GIF up to 2MB</p>
                            {selectedImage && <Image height={300} width={300} src={URL.createObjectURL(selectedImage)} alt="Preview" />}
                        </div>
                    </div>
                </div>
                {/* <div className="h-10 w-full block text-center bg-gray-100 border-2 border-dashed border-gray-400 rounded-lg p-4">
                    <div {...getRootProps()} className="flex justify-center items-center">
                        <input name='image' {...getInputProps()} />
                        <p className="text-gray-600 text-sm">Arrastra y suelta una imagen aquí, o haz clic para seleccionar.</p>
                        {selectedImage && <Image height={300} width={300} src={URL.createObjectURL(selectedImage)} alt="Preview" className="mt-4" />}
                    </div>
                </div> */}
                <button className='bg-blue-500 rounded-lg py-2 px-4 mt-5 text-white font-bold' type='submit'>Subir</button>
            </div>
        </form>
    );
}