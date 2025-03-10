import products from './products.js';
const gallery = document.querySelector('.gallery');
const productView = document.querySelector('.product-view');
const cardTemplate = document.getElementById('product-card-template');
const viewTemplate = document.getElementById('product-view-template');
function showAllProducts() {
    Object.values(products).forEach((product) => {
        const card = cardTemplate.querySelector('.item').cloneNode(true);
        card.dataset.index = product.id.toString();
        card.querySelector('.item-photo img').src = product.photo;
        card.querySelector('.item-photo img').alt = product.title;
        card.querySelector('.item-title').textContent = product.title;
        card.querySelector('.item-description').textContent = product.description;
        card.querySelector('.item-price').textContent = product.price;
        card.addEventListener('click', () => showProductDetails(product, card));
        gallery.appendChild(card);
    });
}
function getElementPosition(element) {
    const rect = element.getBoundingClientRect();
    return {
        left: rect.left,
        top: rect.top,
        width: rect.width,
        height: rect.height
    };
}
function showProductDetails(product, selectedCard) {
    const view = viewTemplate.querySelector('.product-view-container').cloneNode(true);
    // get single product info
    view.querySelector('.product-view-photo img').src = product.photo;
    view.querySelector('.product-view-photo img').alt = product.title;
    view.querySelector('.product-view-title').textContent = product.title;
    view.querySelector('.product-view-description').textContent = product.description;
    view.querySelector('.product-view-price').textContent = product.price;
    view.querySelector('.product-view-more-details').textContent = product.details;
    view.querySelector('.current-product').textContent = product.title; // for breadcrumb
    const otherCards = Array.from(document.querySelectorAll('.gallery .item'))
        .filter(card => card !== selectedCard);
    document.querySelector('.introduction').classList.add('fade-out'); // class to fade elems
    otherCards.forEach(card => {
        card.classList.add('hide-card'); // class to slide cards down
    });
    setTimeout(() => {
        otherCards.forEach(card => {
            card.style.visibility = 'hidden'; // hide cards after animation
        });
    }, 500);
    // show .product-view
    productView.innerHTML = '';
    productView.appendChild(view);
    // get source and target elems
    const sourcePhoto = selectedCard.querySelector('.item-photo');
    const sourceTitle = selectedCard.querySelector('.item-title');
    const sourceDesc = selectedCard.querySelector('.item-description');
    const sourcePrice = selectedCard.querySelector('.item-price');
    const targetPhoto = view.querySelector('.product-view-photo');
    const targetTitle = view.querySelector('.product-view-title');
    const targetDesc = view.querySelector('.product-view-description');
    const targetPrice = view.querySelector('.product-view-price');
    // get source first positions
    const sourcePos = getElementPosition(sourcePhoto);
    const sourceDescPos = getElementPosition(sourceDesc);
    const sourcePricePos = getElementPosition(sourcePrice);
    const sourceTitlePos = getElementPosition(sourceTitle);
    productView.classList.add('active'); // class to show .product-view
    // get target position, elems need prestyling
    const targetPos = getElementPosition(targetPhoto);
    const targetDescPos = getElementPosition(targetDesc);
    const targetPricePos = getElementPosition(targetPrice);
    const targetTitlePos = getElementPosition(targetTitle);
    selectedCard.classList.add('animating'); // class to style animation 
    // fix source elems in original position
    sourcePhoto.style.position = 'fixed';
    sourcePhoto.style.left = sourcePos.left + 'px';
    sourcePhoto.style.top = sourcePos.top + 'px';
    sourcePhoto.style.width = sourcePos.width + 'px';
    sourcePhoto.style.height = sourcePos.height + 'px';
    sourcePhoto.style.margin = '0';
    sourceDesc.style.position = 'fixed';
    sourceDesc.style.left = sourceDescPos.left + 'px';
    sourceDesc.style.top = sourceDescPos.top + 'px';
    sourceDesc.style.width = sourceDescPos.width + 'px';
    sourceDesc.style.margin = '0';
    sourceDesc.style.zIndex = '2000';
    sourcePrice.style.position = 'fixed';
    sourcePrice.style.left = sourcePricePos.left + 'px';
    sourcePrice.style.top = sourcePricePos.top + 'px';
    sourcePrice.style.margin = '0';
    sourcePrice.style.zIndex = '2000';
    sourceTitle.style.position = 'fixed';
    sourceTitle.style.left = sourceTitlePos.left + 'px';
    sourceTitle.style.top = sourceTitlePos.top + 'px';
    sourceTitle.style.margin = '0';
    sourceTitle.style.zIndex = '2000';
    // create css var to animate title
    sourceTitle.style.setProperty('--title-translate-x', `${targetTitlePos.left - sourceTitlePos.left}px`);
    sourceTitle.style.setProperty('--title-translate-y', `${targetTitlePos.top - sourceTitlePos.top}px`);
    void sourcePhoto.offsetWidth;
    void sourceDesc.offsetWidth;
    void sourcePrice.offsetWidth;
    void sourceTitle.offsetWidth;
    // calculate transform distances
    const translateX = targetPos.left - sourcePos.left;
    const translateY = targetPos.top - sourcePos.top;
    const scaleX = targetPos.width / sourcePos.width;
    const scaleY = targetPos.height / sourcePos.height;
    const descTranslateX = targetDescPos.left - sourceDescPos.left;
    const descTranslateY = targetDescPos.top - sourceDescPos.top;
    const priceTranslateX = targetPricePos.left - sourcePricePos.left;
    const priceTranslateY = targetPricePos.top - sourcePricePos.top;
    // apply transformations
    sourcePhoto.style.transform = `translate(${translateX}px, ${translateY}px) scale(${scaleX}, ${scaleY})`;
    sourceDesc.style.transform = `translate(${descTranslateX}px, ${descTranslateY}px)`;
    sourcePrice.style.transform = `translate(${priceTranslateX}px, ${priceTranslateY}px)`;
    // set final width after a delay for smooth animation
    setTimeout(() => {
        sourceDesc.style.width = targetDescPos.width + 'px';
    }, 100);
    // CLICK BACK ARROW
    view.querySelector('.back-arrow').addEventListener('click', () => {
        otherCards.forEach(card => {
            card.style.visibility = '';
        });
        document.querySelector('.introduction').classList.remove('fade-out'); // fade in intro
        void document.body.offsetWidth;
        otherCards.forEach(card => {
            card.classList.remove('hide-card'); // slide cards up
        });
        // .reverse class to animate back
        sourceTitle.classList.add('reverse');
        targetTitle.classList.add('reverse');
        sourcePrice.classList.add('reverse');
        view.querySelector('.product-view-buy').classList.add('reverse');
        view.querySelector('.product-view-more-details').classList.add('reverse');
        view.querySelector('.product-view-header').classList.add('reverse');
        // animate back to initial position
        sourcePhoto.style.transform = '';
        sourceDesc.style.transform = '';
        sourcePrice.style.transform = '';
        // step to reduce width of description, eventually make it clipped
        const initialWidth = sourceDesc.offsetWidth;
        const targetWidth = sourceDescPos.width;
        const step = (initialWidth - targetWidth) / 10;
        let currentWidth = initialWidth;
        const interval = setInterval(() => {
            currentWidth -= step;
            if (currentWidth <= targetWidth) {
                clearInterval(interval);
                sourceDesc.style.width = targetWidth + 'px';
                sourceDesc.style.whiteSpace = 'nowrap';
                sourceDesc.style.overflow = 'hidden';
                sourceDesc.style.textOverflow = 'ellipsis';
            }
            else {
                sourceDesc.style.width = currentWidth + 'px';
            }
        }, 10);
        setTimeout(() => {
            // Reset source elements after reverse animation
            selectedCard.classList.remove('animating');
            sourcePhoto.style.position = '';
            sourcePhoto.style.left = '';
            sourcePhoto.style.top = '';
            sourcePhoto.style.width = '';
            sourcePhoto.style.height = '';
            sourcePhoto.style.margin = '';
            sourceDesc.style.position = '';
            sourceDesc.style.left = '';
            sourceDesc.style.top = '';
            sourceDesc.style.width = '';
            sourceDesc.style.margin = '';
            sourceDesc.style.zIndex = '';
            sourceDesc.style.whiteSpace = '';
            sourceDesc.style.overflow = '';
            sourceDesc.style.textOverflow = '';
            sourcePrice.style.position = '';
            sourcePrice.style.left = '';
            sourcePrice.style.top = '';
            sourcePrice.style.margin = '';
            sourcePrice.style.zIndex = '';
            sourcePrice.classList.remove('reverse');
            sourceTitle.classList.remove('reverse');
            targetTitle.classList.remove('reverse');
            sourceTitle.style.position = '';
            sourceTitle.style.left = '';
            sourceTitle.style.top = '';
            sourceTitle.style.margin = '';
            sourceTitle.style.zIndex = '';
            productView.classList.remove('active');
        }, 200);
    });
    view.querySelector('.product-view-buy').addEventListener('click', () => {
        alert('Buy functionality coming soon!');
    });
}
document.addEventListener('DOMContentLoaded', () => {
    if (!cardTemplate || !viewTemplate) {
        console.error('Templates not found!');
        return;
    }
    showAllProducts();
});
