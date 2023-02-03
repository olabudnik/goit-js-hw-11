import {imageApi} from "../imageAPI";
import { renderGallerMarkUp, clearGalleryMarkUp } from "../helpers/renderFunctions";
import { loadMoreBtn } from "../loadMoreButton";
import Notiflix, { Notify } from "notiflix";

export async function onFormSubmit(event) {
event.preventDefault();
clearGalleryMarkUp();
imageApi.resetPage();
const searchQuery = event.target.searchQuery.value.trim();
if (!searchQuery) {
Notify.warning('Please enter valid value')
    return
}

loadMoreBtn.hide();
imageApi.searchQuery = searchQuery; 
 try {
    const {hits} = await imageApi.fetchImages();
if (hits.length === 0) {
Notify.failure("Sorry, there are no images matching your search query. Please try again.");
return; 
}
renderGallerMarkUp(hits);
loadMoreBtn.show();
checkHitsMax(hits);
}  catch (error) {
    console.log(error)
 }

}

export async function onLoadMoreBtnClick () {
    try {
        loadMoreBtn.loading();
        const {hits, totalHits} = await imageApi.fetchImages();
        renderGallerMarkUp(hits);
        loadMoreBtn.endLoading();
        if(Math.ceil(totalHits/40) <= imageApi.page) {
            console.log('if worked')
        }
        checkHitsMax(hits);
        console.log(imageApi.page)
    } catch (error) {
        console.log(error)
    }
}

function checkHitsMax (hits) {
    if (hits.length < 40) {
        Notify.info("We're sorry, but you've reached the end of search results.");
        loadMoreBtn.hide(); 
    }

}
