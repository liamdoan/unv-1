import products from './products.js';
import { ElementPosition, Product } from './types.js';

const gallery = document.querySelector('.gallery') as HTMLElement;
const productView = document.querySelector('.product-view') as HTMLElement;
const cardTemplate = document.getElementById('product-card-template') as HTMLElement;
const viewTemplate = document.getElementById('product-view-template') as HTMLElement;

function showAllProducts(): void {
    Object.values(products).forEach((product: Product) => {
        const card = cardTemplate.querySelector('.item')!.cloneNode(true) as HTMLElement;
        
        card.dataset.index = product.id.toString();
        (card.querySelector('.item-photo img') as HTMLImageElement).src = product.photo;
        (card.querySelector('.item-photo img') as HTMLImageElement).alt = product.title;
        (card.querySelector('.item-title') as HTMLElement).textContent = product.title;
        (card.querySelector('.item-description') as HTMLElement).textContent = product.description;
        (card.querySelector('.item-price') as HTMLElement).textContent = product.price;
        
        card.addEventListener('click', () => showProductDetails(product, card));
        
        gallery.appendChild(card);
    });
}

function getElementPosition(element: HTMLElement): ElementPosition {
    const rect = element.getBoundingClientRect();
    return {
        left: rect.left,
        top: rect.top,
        width: rect.width,
        height: rect.height
    };
}

function showProductDetails(product: Product, selectedCard: HTMLElement): void {
    const view = viewTemplate.querySelector('.product-view-container')!.cloneNode(true) as HTMLElement;
    
    // get single product info
    (view.querySelector('.product-view-photo img') as HTMLImageElement).src = product.photo;
    (view.querySelector('.product-view-photo img') as HTMLImageElement).alt = product.title;
    (view.querySelector('.product-view-title') as HTMLElement).textContent = product.title;
    (view.querySelector('.product-view-description') as HTMLElement).textContent = product.description;
    (view.querySelector('.product-view-price') as HTMLElement).textContent = product.price;
    (view.querySelector('.product-view-more-details') as HTMLElement).textContent = product.details;
    (view.querySelector('.current-product') as HTMLElement).textContent = product.title; // for breadcrumb
    
    const otherCards = Array.from(document.querySelectorAll('.gallery .item'))
        .filter(card => card !== selectedCard);
    
    (document.querySelector('.introduction') as HTMLElement).classList.add('fade-out'); // class to fade elems

    otherCards.forEach(card => {
        card.classList.add('hide-card'); // class to slide cards down
    });
    
    setTimeout(() => {
        otherCards.forEach(card => {
            (card as HTMLElement).style.visibility = 'hidden'; // hide cards after animation
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
    const sourcePos = getElementPosition(sourcePhoto as HTMLElement);
    const sourceDescPos = getElementPosition(sourceDesc as HTMLElement);
    const sourcePricePos = getElementPosition(sourcePrice as HTMLElement);
    const sourceTitlePos = getElementPosition(sourceTitle as HTMLElement);
    
    productView.classList.add('active'); // class to show .product-view
    
    // get target position, elems need prestyling
    const targetPos = getElementPosition(targetPhoto as HTMLElement);
    const targetDescPos = getElementPosition(targetDesc as HTMLElement);
    const targetPricePos = getElementPosition(targetPrice as HTMLElement);
    const targetTitlePos = getElementPosition(targetTitle as HTMLElement);
    
    selectedCard.classList.add('animating'); // class to style animation 
    
    // fix source elems in original position
    (sourcePhoto as HTMLElement).style.position = 'fixed';
    (sourcePhoto as HTMLElement).style.left = sourcePos.left + 'px';
    (sourcePhoto as HTMLElement).style.top = sourcePos.top + 'px';
    (sourcePhoto as HTMLElement).style.width = sourcePos.width + 'px';
    (sourcePhoto as HTMLElement).style.height = sourcePos.height + 'px';
    (sourcePhoto as HTMLElement).style.margin = '0';
    
    (sourceDesc as HTMLElement).style.position = 'fixed';
    (sourceDesc as HTMLElement).style.left = sourceDescPos.left + 'px';
    (sourceDesc as HTMLElement).style.top = sourceDescPos.top + 'px';
    (sourceDesc as HTMLElement).style.width = sourceDescPos.width + 'px';
    (sourceDesc as HTMLElement).style.margin = '0';
    (sourceDesc as HTMLElement).style.zIndex = '2000';

    (sourcePrice as HTMLElement).style.position = 'fixed';
    (sourcePrice as HTMLElement).style.left = sourcePricePos.left + 'px';
    (sourcePrice as HTMLElement).style.top = sourcePricePos.top + 'px';
    (sourcePrice as HTMLElement).style.margin = '0';
    (sourcePrice as HTMLElement).style.zIndex = '2000';

    (sourceTitle as HTMLElement).style.position = 'fixed';
    (sourceTitle as HTMLElement).style.left = sourceTitlePos.left + 'px';
    (sourceTitle as HTMLElement).style.top = sourceTitlePos.top + 'px';
    (sourceTitle as HTMLElement).style.margin = '0';
    (sourceTitle as HTMLElement).style.zIndex = '2000';
    
    // create css var to animate title
    (sourceTitle as HTMLElement).style.setProperty('--title-translate-x', `${targetTitlePos.left - sourceTitlePos.left}px`);
    (sourceTitle as HTMLElement).style.setProperty('--title-translate-y', `${targetTitlePos.top - sourceTitlePos.top}px`);
    
    void (sourcePhoto as HTMLElement).offsetWidth;
    void (sourceDesc as HTMLElement).offsetWidth;
    void (sourcePrice as HTMLElement).offsetWidth;
    void (sourceTitle as HTMLElement).offsetWidth;
    
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
    (sourcePhoto as HTMLElement).style.transform = `translate(${translateX}px, ${translateY}px) scale(${scaleX}, ${scaleY})`;
    (sourceDesc as HTMLElement).style.transform = `translate(${descTranslateX}px, ${descTranslateY}px)`;
    (sourcePrice as HTMLElement).style.transform = `translate(${priceTranslateX}px, ${priceTranslateY}px)`;
    
    // set final width after a delay for smooth animation
    setTimeout(() => {
        (sourceDesc as HTMLElement).style.width = targetDescPos.width + 'px';
    }, 100);
    
    // CLICK BACK ARROW
    (view.querySelector('.back-arrow') as HTMLElement).addEventListener('click', () => {
        otherCards.forEach(card => {
            (card as HTMLElement).style.visibility = '';
        });
    
        (document.querySelector('.introduction') as HTMLElement).classList.remove('fade-out'); // fade in intro
        
        void document.body.offsetWidth;
        
        otherCards.forEach(card => {
            card.classList.remove('hide-card'); // slide cards up
        });

        // .reverse class to animate back
        (sourceTitle as HTMLElement).classList.add('reverse');
        (targetTitle as HTMLElement).classList.add('reverse');
        (sourcePrice as HTMLElement).classList.add('reverse');
        (view.querySelector('.product-view-buy') as HTMLElement).classList.add('reverse');
        (view.querySelector('.product-view-more-details') as HTMLElement).classList.add('reverse');
        (view.querySelector('.product-view-header') as HTMLElement).classList.add('reverse');
        
        // animate back to initial position
        (sourcePhoto as HTMLElement).style.transform = '';
        (sourceDesc as HTMLElement).style.transform = '';
        (sourcePrice as HTMLElement).style.transform = '';

        // step to reduce width of description, eventually make it clipped
        const initialWidth = (sourceDesc as HTMLElement).offsetWidth;
        const targetWidth = sourceDescPos.width;
        const step = (initialWidth - targetWidth) / 10;
        let currentWidth = initialWidth;
        
        const interval = setInterval(() => {
            currentWidth -= step;
            if (currentWidth <= targetWidth) {
                clearInterval(interval);
                (sourceDesc as HTMLElement).style.width = targetWidth + 'px';
                (sourceDesc as HTMLElement).style.whiteSpace = 'nowrap';
                (sourceDesc as HTMLElement).style.overflow = 'hidden';
                (sourceDesc as HTMLElement).style.textOverflow = 'ellipsis';
            } else {
                (sourceDesc as HTMLElement).style.width = currentWidth + 'px';
            }
        }, 10);

        setTimeout(() => {
            // Reset source elements after reverse animation
            selectedCard.classList.remove('animating');
            (sourcePhoto as HTMLElement).style.position = '';
            (sourcePhoto as HTMLElement).style.left = '';
            (sourcePhoto as HTMLElement).style.top = '';
            (sourcePhoto as HTMLElement).style.width = '';
            (sourcePhoto as HTMLElement).style.height = '';
            (sourcePhoto as HTMLElement).style.margin = '';

            (sourceDesc as HTMLElement).style.position = '';
            (sourceDesc as HTMLElement).style.left = '';
            (sourceDesc as HTMLElement).style.top = '';
            (sourceDesc as HTMLElement).style.width = '';
            (sourceDesc as HTMLElement).style.margin = '';
            (sourceDesc as HTMLElement).style.zIndex = '';
            (sourceDesc as HTMLElement).style.whiteSpace = '';
            (sourceDesc as HTMLElement).style.overflow = '';
            (sourceDesc as HTMLElement).style.textOverflow = '';

            (sourcePrice as HTMLElement).style.position = '';
            (sourcePrice as HTMLElement).style.left = '';
            (sourcePrice as HTMLElement).style.top = '';
            (sourcePrice as HTMLElement).style.margin = '';
            (sourcePrice as HTMLElement).style.zIndex = '';
            (sourcePrice as HTMLElement).classList.remove('reverse');

            (sourceTitle as HTMLElement).classList.remove('reverse');
            (targetTitle as HTMLElement).classList.remove('reverse');

            (sourceTitle as HTMLElement).style.position = '';
            (sourceTitle as HTMLElement).style.left = '';
            (sourceTitle as HTMLElement).style.top = '';
            (sourceTitle as HTMLElement).style.margin = '';
            (sourceTitle as HTMLElement).style.zIndex = '';

            productView.classList.remove('active');
        }, 200);
    });
    
    (view.querySelector('.product-view-buy') as HTMLElement).addEventListener('click', () => {
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
