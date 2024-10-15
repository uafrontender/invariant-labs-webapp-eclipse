import React, { ChangeEvent, useState } from 'react'
import { Controller } from 'react-hook-form'
import { CloudUpload as UploadIcon, Image as ImageIcon } from '@mui/icons-material'
import useStyles from './styles'

import Logo1 from '@static/svg/SolanaCreator/Logo.svg'
import Logo2 from '@static/svg/SolanaCreator/Logo2.svg'
import Cat1 from '@static/svg/SolanaCreator/Cat1.svg'
import Cat2 from '@static/svg/SolanaCreator/Cat2.svg'
import { Box, Button } from '@mui/material'

interface ImagePickerProps {
  control: any
}

const defaultImages: string[] = [Logo1, Logo2, Cat1, Cat2]

export const ImagePicker: React.FC<ImagePickerProps> = ({ control }) => {
  const { classes } = useStyles()
  const [customImage, setCustomImage] = useState<string | null>(null)

  const handleImageUpload = (
    e: ChangeEvent<HTMLInputElement>,
    onChange: (value: string) => void
  ) => {
    const file = e.target.files?.[0]
    if (file) {
      const reader = new FileReader()
      reader.onload = (e: ProgressEvent<FileReader>) => {
        if (e.target?.result) {
          const newCustomImage = e.target.result as string
          setCustomImage(newCustomImage)
          onChange(newCustomImage)
        }
      }
      reader.readAsDataURL(file)
    }
  }

  return (
    <Controller
      name='image'
      control={control}
      defaultValue=''
      render={({ field: { onChange, value } }) => (
        <Box className={classes.root}>
          <Box className={classes.imageContainer}>
            {defaultImages.map((image, index) => (
              <Button
                key={index}
                className={`${classes.imageButton} ${value === image ? 'selected' : ''}`}
                onClick={() => onChange(image)}>
                <img src={image} alt={`Default ${index + 1}`} />
              </Button>
            ))}
            <Button
              component='label'
              className={`${classes.imageButton} ${value === customImage ? 'selected' : ''}`}
              onClick={() => customImage && onChange(customImage)}>
              {customImage ? (
                <img src={customImage} alt='Custom' className={classes.uploadedImage} />
              ) : (
                <ImageIcon className={classes.placeholderIcon} />
              )}
              <input
                accept='image/*'
                className={classes.hiddenInput}
                type='file'
                onChange={e => handleImageUpload(e, onChange)}
              />
            </Button>
          </Box>
          <Button component='label' className={classes.uploadButton} disableRipple>
            <UploadIcon className={classes.uploadIcon} />
            <input
              accept='image/*'
              className={classes.hiddenInput}
              id='contained-button-file-full-width'
              type='file'
              onChange={e => handleImageUpload(e, onChange)}
            />
          </Button>
        </Box>
      )}
    />
  )
}

export default ImagePicker
