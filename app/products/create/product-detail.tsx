'use client';
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Table, TableBody, TableCaption, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { generateInrAmount } from "@/utils/generateInrAmount";
import clsx from "clsx";
import { Package, PackageX, Pen, SquarePen, Tag } from "lucide-react";
import { useEffect, useRef, useState } from "react";
import { Coordinates, Cropper, CropperImage, CropperPreview, CropperPreviewRef, CropperRef, CropperState, Size, Transforms } from 'react-advanced-cropper';
import 'react-advanced-cropper/dist/style.css'

type ProductDetails = {
    productType: string | null;
    name: string;
    price: number;
    discount: number;
    stock: number;
    category: string[];
    images: string[] | File[];
    isActive: boolean;
    variants: {
        sku: string;
        price: number;
        stock: number;
        options: Record<string, string>[];
    }[];
    options: {
        name: string;
        values: string[];
    }[];
    metaFields: {
        namespace: string;
        key: string;
        value: string | number | boolean | any[] | {
            [x: string]: unknown;
        };
        type: string;
    }[];
    description?: string | undefined;
}

function ProductDetail({
    category,
    discount,
    images,
    isActive,
    metaFields,
    name,
    options,
    productType,
    stock,
    variants,
    description,
    price
}: ProductDetails) {
    const cropperRef = useRef<CropperRef>(null);
    const previewRef = useRef<CropperPreviewRef>(null)
    const restImages = images.slice(1);
    const discountPrice = (price - ((price * (discount > 0 ? discount : 0)) / 100));

    const [mainImage, setMainImage] = useState<string>(() =>
        images[0] instanceof File ? URL.createObjectURL(images[0]) : images[0]
    );

    const croppedImgStateRef = useRef<CropperState | null>(null);

    const [croppedImage, setCroppedImage] = useState<string | null>(null);
    const [dialogOpen, setDialogOpen] = useState(false);
    const [cropperReady, setCropperReady] = useState(false);
    const [cropCoordinates, setCropCoordinates] = useState<Coordinates | null>(null);
    const [firstFile, setFirstFile] = useState(images[0]);

    useEffect(() => {
        setMainImage(images[0] instanceof File ? URL.createObjectURL(images[0]) : images[0]);
        setCroppedImage(images[0] instanceof File ? URL.createObjectURL(images[0]) : images[0]);
        setFirstFile(images[0]);

        setCropCoordinates(croppedImgStateRef.current?.coordinates as Coordinates);

        // const firstImage = images[0];

        // if(
        //     (firstImage instanceof File && firstFile instanceof File) && 
        //     (firstImage.name === firstFile.name) && 
        //     (firstImage.size === firstFile.size) 
        // ) {
        //     const coords = cropperRef.current?.getCoordinates();
        //     setCropCoordinates(cropCoordinates);
        //     console.log('Both are same files')
        // }

        if (images.length === 0) {
            setCroppedImage(null);
            setCropCoordinates(null);
            croppedImgStateRef.current = null;
        }

    }, [images]);

    useEffect(() => {
        if(dialogOpen) {
            setCroppedImage(mainImage);
        }
        if (dialogOpen && cropperReady && cropperRef.current && previewRef.current) {
            previewRef.current.update(cropperRef.current);
        }

        if(!dialogOpen) {
            setCropperReady(false);
        }
    }, [dialogOpen, cropperReady])

    function imageUpdate(cropper: CropperRef) {
        previewRef.current?.update(cropper);
        const image = cropper.getImage();
        const coords = cropper.getCoordinates();
        const imgState = cropperRef.current?.getState();

        if(imgState) {
            croppedImgStateRef.current = imgState;
        }

        if(coords) {
            setCropCoordinates(coords);
        }

        if(image) {
            setCroppedImage(image.src as string);
        }
    }

    // console.log({
    //     previewRef,
    //     croppedImage,
    //     mainImage,
    //     images
    // })

    return (
        <div className="font-quickSand">
            <div className="flex flex-col gap-y-4">
                {
                    (croppedImage || mainImage) ? (
                        <div className="relative">
                            {
                                (croppedImage && mainImage && mainImage === croppedImage) ? (
                                    <CropperPreview
                                        ref={previewRef}
                                        // image={cropperRef.current?.getImage()}
                                        className="preview w-full rounded-md min-h-48 max-h-48 object-cover"
                                        state={{
                                            coordinates: croppedImgStateRef.current?.coordinates as Coordinates,
                                            boundary: croppedImgStateRef.current?.boundary as Size,
                                            imageSize: croppedImgStateRef.current?.imageSize as Size,
                                            transforms: croppedImgStateRef.current?.transforms as Transforms,
                                            visibleArea: croppedImgStateRef.current?.visibleArea as Coordinates
                                        }}
                                    />
                                ) : (
                                    <img
                                        src={mainImage || croppedImage as string}
                                        className="w-full h-full rounded-md max-h-48 object-contain"
                                    />
                                )
                            }
                            <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
                                <DialogTrigger className="absolute bottom-0 right-0 z-10 cursor-pointer bg-neutral-100 dark:bg-zinc-700 p-3 rounded-md shadow">
                                    {/* <Button variant="secondary" type="button" className="absolute bottom-4 right-4 z-10 cursor-pointer"> */}
                                    <SquarePen size={12} />
                                    {/* </Button> */}
                                </DialogTrigger>
                                <DialogContent className="p-0 w-1/2 max-h-1/2 overflow-y-auto">
                                    <DialogTitle className="px-4 pt-4 pb-2">Crop Image</DialogTitle>
                                    <Cropper
                                        ref={cropperRef}
                                        src={croppedImage || mainImage}
                                        className="cropper"
                                        defaultCoordinates={cropCoordinates || undefined}
                                        onReady={() => {
                                            setCropperReady(true);
                                        }}
                                        onUpdate={imageUpdate}
                                        stencilProps={{
                                            // aspectRatio: {
                                            //     minimum: 4 / 3,
                                            //     maximum: 4 / 3
                                            // },
                                            grid: true
                                        }}
                                        
                                    />
                                </DialogContent>
                            </Dialog>
                        </div>
                    ) : (
                        <div className="w-full h-48 bg-neutral-200 dark:bg-zinc-700 rounded-lg" />
                    )
                }
                {
                    restImages.length > 0 ? (
                        <div className="grid grid-cols-4 gap-x-2 gap-y-4">
                            {
                                restImages.map((image, idx) => {
                                    let imageUrl = image;
                                    if (image instanceof File) imageUrl = URL.createObjectURL(image);

                                    return (
                                        <img src={imageUrl} key={idx} className="rounded-sm cursor-pointer max-h-20 w-full object-contain" />
                                    )
                                })
                            }
                        </div>
                    ) : (
                        <div className="grid grid-cols-4 gap-x-2 gap-y-4">
                            {
                                Array.from({ length: 4 }, (_, i) => i).map(item => (
                                    <div key={item} className="h-12 bg-neutral-200 dark:bg-zinc-700 rounded-sm"></div>
                                ))
                            }
                        </div>

                    )
                }
            </div>

            <div className="my-3 space-y-3">
                <p className="text-wrap wrap-break-word">
                    <span className={clsx('text-lg block text-wrap', !name && 'text-gray-500')}>
                        {name ? name : "Product name here..."} {' '}
                    </span>
                    <span className="block dark:text-neutral-300 light:text-neutral-400">
                        ({productType})
                    </span>
                </p>

                <div className="flex flex-col">
                    <p className="text-xl">Price:</p>
                    <div className="flex gap-x-3 items-center">
                        <p className={clsx("text-lg", price > 0 ? " line-through font-semibold" : "text-gray-500")}>
                            {
                                price > 0 ?
                                    <>
                                        {generateInrAmount(price)}
                                    </> :
                                    'Price Here...'
                            }
                        </p>
                        <p>
                            <span className={clsx("text-lg", discountPrice === 0 && "text-gray-500")}>
                                {
                                    discountPrice > 0 ? <>
                                        {generateInrAmount(discountPrice)}
                                    </> : "Discount Price Here..."
                                }
                            </span>
                            <span className={clsx("dark:text-gray-400 text-gray-700 mx-1", price === 0 && "text-gray-500")}>
                                {
                                    price > 0 ? `(${discount > 0 ? discount : 0}% Off)` : 'Discount Here...'
                                }
                            </span>
                        </p>
                    </div>
                </div>

                {/* <div className="flex flex-wrap gap-x-2 gap-y-3">
                    {
                        category.length > 0 ? category.map((item, index) => {
                            return (
                                <div
                                    key={index}
                                    className="px-4 py-2 rounded-sm dark:bg-zinc-800 dark:text-white bg-gray-100 text-black"
                                >
                                    {item}
                                </div>
                            )
                        }) : (
                            <p className="text-gray-500">
                                Categories Here...
                            </p>
                        )
                    }
                </div> */}

                <div>
                    <p className={clsx(!description && 'text-gray-500')}>
                        {description ? description : "Description Here..."}
                    </p>
                </div>

                <div>
                    {
                        options.length > 0 ? options.map((item, idx) => {
                            return (
                                <div key={idx} className="flex flex-col space-y-2">
                                    <p>{item.name}</p>
                                    <div className="flex gap-x-2">
                                        {
                                            item.values.length > 0 && item.values.map((value, valIdx) => {
                                                return (
                                                    <p
                                                        key={valIdx}
                                                        className="bg-neutral-100 dark:bg-zinc-700 px-2 py-1 text-sm rounded-sm shadow "
                                                    >
                                                        {value}
                                                    </p>
                                                )
                                            })
                                        }
                                    </div>
                                </div>
                            )
                        }) : <p className="text-gray-500">Options here...</p>
                    }
                </div>

                <div>
                    {
                        variants.length > 0 ? <div className="my-2">
                            <p className="text-lg">Variants</p>
                            {
                                variants.map((variant, idx) => (
                                    <div
                                        key={idx}
                                        className="px-4 py-2 border border-neutral-200 dark:border-zinc-700 rounded-md my-2 flex flex-col gap-y-2"
                                    >
                                        <p className="flex gap-x-2 items-center">
                                            <Pen size={12} />
                                            {variant.sku.length > 0 ? variant.sku : "No name given"}
                                        </p>
                                        <p className="flex gap-x-2 items-center">
                                            <Tag size={12} />
                                            {/* Rs. {variant.price} */}
                                            {generateInrAmount(variant.price)}
                                        </p>
                                        <p className="flex gap-x-2 items-center">
                                            {
                                                variant.stock > 0 ?
                                                    <Package size={12} /> :
                                                    <PackageX size={12} />
                                            }
                                            {variant.stock > 0 ? `${variant.stock} items left` : 'No items left'}
                                        </p>
                                        {
                                            variant.options.length > 0 ? (
                                                <Table>
                                                    <TableCaption>{variant.sku} Options</TableCaption>
                                                    <TableHeader className="w-[100px]">
                                                        <TableRow>
                                                            <TableHead>Key</TableHead>
                                                            <TableHead>Value</TableHead>
                                                        </TableRow>
                                                    </TableHeader>
                                                    <TableBody>
                                                        {
                                                            variant.options.map((option, optIndex) => {
                                                                return (
                                                                    <TableRow key={optIndex}>
                                                                        <TableCell>{option.key}</TableCell>
                                                                        <TableCell>{option.value}</TableCell>
                                                                    </TableRow>
                                                                )
                                                            })
                                                        }
                                                    </TableBody>
                                                </Table>
                                            ) : <p className="flex gap-x-2 items-center">
                                                <PackageX size={12} />
                                                No options added {variant.sku.length > 0 ? variant.sku.length : "for this product"}
                                            </p>
                                        }
                                    </div>
                                ))
                            }
                        </div> : (
                            <p className="text-gray-500">
                                Variants Here...
                            </p>
                        )
                    }
                </div>
            </div>
        </div>
    )
}

export default ProductDetail