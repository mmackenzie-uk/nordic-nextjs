import { getAlbums } from "@/app/actions/s3-get-albums";
import Photos from "./photos";

export default async function Home() {
    const albums = await getAlbums();
    return (
        <section className="section">
            <Photos albums={albums!}/>
        </section>
    );
}
