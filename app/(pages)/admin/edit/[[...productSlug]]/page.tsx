
import { getFormData } from "@/app/actions/form-actions";
import { getCategories } from "@/app/actions/get-actions";
import Form from "@/app/ui-client/form/form";
import { _Object } from "@aws-sdk/client-s3";

export default async function Page({ params, }: {params: Promise<{ productSlug: string }>}) {
    const { productSlug } = await params;
    const formDTO = await getFormData(productSlug)
    let edit = false;
    if (productSlug) {
        edit = true;
    }
    const categoriesDTO = await getCategories();

    return <Form formDTO={formDTO} categoriesDTO={categoriesDTO} edit={edit}/>

  }

  