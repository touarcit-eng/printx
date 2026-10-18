/* PrintX storefront: local cart + explicit WhatsApp hand-off. */
const PRODUCTS=[
 {id:'mug',name:'Mug personnalisé',price:1200,art:'☕',description:'Photo ou message sur mug céramique.'},
 {id:'tee',name:'T-shirt imprimé',price:1800,art:'👕',description:'Impression personnalisée, plusieurs tailles.'},
 {id:'frame',name:'Cadre photo',price:2200,art:'🖼️',description:'Votre souvenir prêt à exposer.'},
 {id:'card',name:'Cartes & invitations',price:800,art:'✉️',description:'Lot de 10 cartes personnalisées.'}
];
const STORAGE_KEY='printx-cart-v1';
// Replace only with the business number in international digits (e.g. 213555000000), no + or spaces.
const WHATSAPP_NUMBER='213670478049';
let cart=[];
const money=value=>new Intl.NumberFormat('fr-DZ',{maximumFractionDigits:0}).format(value)+' DA';
function loadCart(){try{const saved=JSON.parse(localStorage.getItem(STORAGE_KEY));cart=Array.isArray(saved)?saved.filter(x=>PRODUCTS.some(p=>p.id===x.id)&&Number.isInteger(x.qty)&&x.qty>0):[]}catch{cart=[]}}
function saveCart(){localStorage.setItem(STORAGE_KEY,JSON.stringify(cart));renderCart()}
function total(){return cart.reduce((sum,item)=>sum+PRODUCTS.find(p=>p.id===item.id).price*item.qty,0)}
function renderProducts(){document.querySelector('#productGrid').innerHTML=PRODUCTS.map(p=>`<article class="product"><div class="product-art">${p.art}</div><div><h3>${p.name}</h3><p>${p.description}</p><p class="price">À partir de ${money(p.price)}</p><button type="button" data-add="${p.id}">Ajouter au panier</button></div></article>`).join('')}
function renderCart(){const holder=document.querySelector('#cartItems');holder.innerHTML=cart.length?cart.map(item=>{const p=PRODUCTS.find(product=>product.id===item.id);return `<div class="cart-item"><div><strong>${p.name} × ${item.qty}</strong><br><small>${money(p.price*item.qty)}</small></div><button type="button" data-remove="${p.id}">Retirer</button></div>`}).join(''):'<p>Votre panier est vide.</p>';document.querySelector('#cartCount').textContent=cart.reduce((s,x)=>s+x.qty,0);document.querySelector('#cartTotal').textContent=money(total());document.querySelector('#checkoutTotal').textContent=money(total())}
function openCart(show){document.querySelector('#cart').classList.toggle('open',show);document.querySelector('#scrim').classList.toggle('show',show);document.querySelector('#cart').setAttribute('aria-hidden',String(!show))}
function add(id){const existing=cart.find(x=>x.id===id);existing?existing.qty++:cart.push({id,qty:1});saveCart();openCart(true)}
function orderText(data){const lines=cart.map(item=>{const p=PRODUCTS.find(x=>x.id===item.id);return `• ${p.name} × ${item.qty} — ${money(p.price*item.qty)}`});return ['Bonjour PrintX, je souhaite confirmer cette demande de commande :','',...lines,``,`Total estimé : ${money(total())}`,`Nom : ${data.name}`,`Téléphone : ${data.phone}`,`Adresse / retrait : ${data.address}`,data.note?`Note : ${data.note}`:'','', 'Merci de me confirmer la disponibilité, le prix final et le délai avant toute production.'].filter(Boolean).join('\n')}
document.addEventListener('click',event=>{const id=event.target.dataset.add;if(id)add(id);const remove=event.target.dataset.remove;if(remove){cart=cart.map(x=>x.id===remove?{...x,qty:x.qty-1}:x).filter(x=>x.qty);saveCart()}});
document.querySelector('#openCart').onclick=()=>openCart(true);document.querySelector('#closeCart').onclick=()=>openCart(false);document.querySelector('#scrim').onclick=()=>openCart(false);document.querySelector('#goCheckout').onclick=()=>openCart(false);
document.querySelector('#checkoutForm').addEventListener('submit',event=>{event.preventDefault();const message=document.querySelector('#formMessage');const data=Object.fromEntries(new FormData(event.currentTarget));if(!cart.length){message.textContent='Ajoutez au moins un produit avant de préparer la commande.';return}if(!event.currentTarget.checkValidity()){event.currentTarget.reportValidity();return}if(!WHATSAPP_NUMBER){message.textContent='Le numéro WhatsApp de PrintX doit être ajouté dans app.js avant l’envoi. Votre panier reste enregistré sur cet appareil.';return}const url=`https://wa.me/${WHATSAPP_NUMBER}?text=${encodeURIComponent(orderText(data))}`;window.open(url,'_blank','noopener');message.textContent='WhatsApp a été ouvert avec votre demande. Vérifiez le message puis envoyez-le seulement si tout est correct.'});
loadCart();renderProducts();renderCart();document.querySelector('#year').textContent=new Date().getFullYear();
