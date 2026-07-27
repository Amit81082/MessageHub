"use client"
import React from 'react'
import Modal from '@/app/components/Modal';
import Image from 'next/image';

interface ImageModalProps {
  isOpen: boolean;
  onClose: () => void
  src?: string | null 
}

const ImageModal = ({ isOpen, onClose, src }: ImageModalProps) => {
  if (!src) {
    return null;
  }
  return (
    <Modal isOpen={isOpen} onClose={onClose}>
      <div className="w-80 h-80">
        <Image
          fill
          style={{ objectFit: "cover" }}
          src={src}
          alt="Image"
        />
      </div>
    </Modal>
  )
}

export default ImageModal



