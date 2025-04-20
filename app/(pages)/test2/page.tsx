
import { getAlbums } from "@/app/actions/s3-get-albums";
import Photos from "./photos";

// @ts-nocheck 


export default async function Home() {

    const albums = await getAlbums();


    return (
        <section className="section">
            <div className="edit-product-image-header" style={{maxWidth: "60%", marginBottom: "10px"}}>
                <div>
                    <h2 className="edit-product-image-header-title">Images:</h2>
                </div>
            </div>
            <Photos albums={albums!}/>
        </section>
    );
}
