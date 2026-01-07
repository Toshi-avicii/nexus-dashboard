import { ChangeEvent, useRef, useState } from 'react'
import { Input } from '../ui/input'
import { Button } from '../ui/button';
import { CircleX, Loader2, Upload } from 'lucide-react';
import { Tooltip, TooltipContent, TooltipTrigger } from '../ui/tooltip';

interface DataTableBulkUploadProps {
    onUpload: (file: File) => void;
    accept?: string;
    allowedTypes?: string[];
    isLoading?: boolean;
}

function DataTableBulkUpload({ 
    onUpload,
    accept = '.xls,.xlsx',
    allowedTypes = [
        "application/vnd.ms-excel",
        "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
    ],
    isLoading = false
}: DataTableBulkUploadProps) {
    const [excelSheet, setExcelSheet] = useState<File | null>(null);
    const inputFileRef = useRef<HTMLInputElement | null>(null);

    return (
        <div className='flex gap-x-2 items-center'>
            <Input
                disabled={isLoading}
                ref={inputFileRef}
                type='file'
                accept={accept}
                className='w-1/2'
                onChange={(event: ChangeEvent<HTMLInputElement>) => {
                    if (!event.target.files?.length) return;
                    const selectedFile = event.target.files[0];
                    if (!allowedTypes.includes(selectedFile.type)) {
                        alert("Only Excel files are allowed");
                        return;
                    }
                    setExcelSheet(selectedFile);
                }}
            />
            <Tooltip>
                <TooltipTrigger asChild>
                    <Button
                        disabled={!excelSheet || isLoading}
                        type='button'
                        variant="secondary"
                        size="icon-sm"
                        className='cursor-pointer'
                        onClick={async() => {
                            if(excelSheet) {
                                if(excelSheet) onUpload(excelSheet);
                            }
                            setExcelSheet(null);
                            if(inputFileRef.current) inputFileRef.current.value = '';
                        }}
                    >
                        {
                            isLoading ? <Loader2 className="h-4 w-4 animate-spin" /> : <Upload />
                        }
                    </Button>
                </TooltipTrigger>
                <TooltipContent>
                    Upload File
                </TooltipContent>
            </Tooltip>

            {
                excelSheet && (
                    <Tooltip>
                        <TooltipTrigger asChild>
                            <Button
                                type='button'
                                variant="secondary"
                                size="icon-sm"
                                className='cursor-pointer'
                                onClick={() => {
                                    setExcelSheet(null);
                                    if (inputFileRef.current) {
                                        inputFileRef.current.value = "";
                                    }
                                }}
                            >
                                <CircleX />
                            </Button>
                        </TooltipTrigger>
                        <TooltipContent>Remove File</TooltipContent>
                    </Tooltip>
                )
            }
        </div>
    )
}

export default DataTableBulkUpload