import { Fragment, useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetDescription } from "@/components/ui/sheet";
import Commonform from "@/components/common/form";
import { addProductsFormElements } from "@/config";
import ProductImageUpload from "@/components/admin-view/image-upload";
import { useDispatch, useSelector } from "react-redux";
import { addNewProduct, deleteProduct, editProduct, fetchAllProducts } from "@/store/admin/products-slice";
import { useToast } from "@/hooks/use-toast";
import AdminProductTile from "@/components/admin-view/product-tile";

const initialFormData = {
    image : null,
    title : '',
    description : '',
    category : '',
    brand : '',
    price : '',
    salePrice : '',
    totalStock : ''
}

function AdminProducts(){

    const [openCreateProductsDialog, setOpenCreateProductsDialog] = useState(false);
    const [formData, setFormData] = useState(initialFormData);
    const [imageFile, setImageFile] = useState(null);
    const [uploadedImageUrl, setUploadedImageUrl] = useState('');
    const [imageLoadingState, setImageLoadingState] = useState(false);

    const [currentEditedId, setCurrentEditedId] = useState(null);

    const {productList} = useSelector(state => state.adminProducts)
    const dispatch = useDispatch();
    const {toast} = useToast();

    function onSubmit(event)
    {
        event.preventDefault();
        // console.log("CurrentId = ", currentEditedId);
        currentEditedId !== null ?
        dispatch(editProduct({

            id : currentEditedId, formData

        })).then((data) => {
            console.log(data, "edit");

            if (data?.payload?.success){
                dispatch(fetchAllProducts());
                setFormData(initialFormData);
                setOpenCreateProductsDialog(false);
                setCurrentEditedId(null);
            }
        })

        : dispatch(addNewProduct({
            ...formData,
            image : uploadedImageUrl
        })).then((data) => {
            if (data?.payload?.success)
            {
                dispatch(fetchAllProducts());
                setOpenCreateProductsDialog(false);
                setImageFile(null);
                setFormData(initialFormData);
                toast({
                    title : 'Product add successfully !'
                })
            }
        })
    };

    function handleDelete(getCurrentProductId){
        // console.log("CurrentProductId = ", getCurrentProductId);
        dispatch(deleteProduct(getCurrentProductId))
        .then((data) => {
            if (data?.payload?.success){
                dispatch(fetchAllProducts());
            }
        })
    }

    function isFormValid()
    {
        return Object.keys(formData)
        .map((key) => formData[key] !== '')
        .every((item) => item);
    }

    useEffect(() => {

        dispatch(fetchAllProducts());

    }, [dispatch])

    console.log(formData, "formData")

    return (
        
        <Fragment>

            <div className="mb-5 w-full flex justify-end">

                <Button onClick={()=>setOpenCreateProductsDialog(true)}>Add New Product</Button>

            </div>

            <div className="grid gap-4 md:grid-cols-3 lg:grid-cols-4">
                    {
                        productList && productList.length > 0 ?

                        productList.map((productItem) => 

                        <AdminProductTile key={productItem._id} setFormData={setFormData} 
                        setOpenCreateProductsDialog={setOpenCreateProductsDialog} 
                        setCurrentEditedId={setCurrentEditedId} 
                        product={productItem}
                        handleDelete = {handleDelete}
                        />
                        
                        ) : null
                    }
            </div>

            <Sheet open={openCreateProductsDialog} onOpenChange={() => {setOpenCreateProductsDialog(false); setCurrentEditedId(null); setFormData(initialFormData)}}>

                <SheetContent side = "right" className="overflow-auto">

                    <SheetHeader>
                        <SheetTitle> {`${currentEditedId !== null ? 'Edit Product' : 'Add New Product'}`} </SheetTitle>    
                        <SheetDescription />
                    </SheetHeader>    

                    <ProductImageUpload 
                    imageFile={imageFile} 
                    setImageFile={setImageFile} 
                    uploadedImageUrl={uploadedImageUrl} 
                    setUploadedImageUrl={setUploadedImageUrl}
                    setImageLoadingState={setImageLoadingState}
                    imageLoadingState = {imageLoadingState} 
                    isEditMode = {currentEditedId !== null}
                    />

                    <div className="py-6">

                        <Commonform formControls={addProductsFormElements} formData={formData} setFormData={setFormData} 
                        buttonText={`${currentEditedId !== null ? 'Edit' : 'Add'}`} 
                        isBtnDisabled={!isFormValid()}
                        onSubmit={onSubmit}/>

                    </div>
                    
                </SheetContent>                

            </Sheet>

        </Fragment>

    );
}

export default AdminProducts;