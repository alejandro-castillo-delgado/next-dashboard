"use client";
import React, { useState } from 'react';
import { useDropzone } from 'react-dropzone';

const ImageUpload = () => {

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

    return (
        <div {...getRootProps()}>
            <input {...getInputProps()} />
            <p>Arrastra y suelta una imagen aquí, o haz clic para seleccionar.</p>
            {selectedImage && <img src={URL.createObjectURL(selectedImage)} alt="Preview" />}
        </div>
    );
}

export default ImageUpload
