// // 'use strict';
// // console.log(111111);
// // var stripe = Stripe('pk_test_QOanbaN1OiMxIP2OfS8AxK0D');
// //
// // function registerElements(elements, exampleName) {
// //   var formClass = '.' + exampleName;
// //   var example = document.querySelector(formClass);
// //   var form = example.querySelector('form');
// //   var resetButton = example.querySelector('a.reset');
// //   function disableInputs() {
// //     Array.prototype.forEach.call(
// //       form.querySelectorAll(
// //         "input[type='text'], input[type='email'], input[type='tel']"
// //       ),
// //       function(input) {
// //         input.setAttribute('disabled', 'true');
// //       }
// //     );
// //   }
// //
// //   function triggerBrowserValidation() {
// //     var submit = document.createElement('input');
// //     submit.type = 'submit';
// //     submit.style.display = 'none';
// //     form.appendChild(submit);
// //     submit.click();
// //     submit.remove();
// //   }
// //   form.addEventListener('submit', function(e) {
// //     e.preventDefault();
// //
// //     var plainInputsValid = true;
// //     Array.prototype.forEach.call(form.querySelectorAll('input'), function(
// //       input
// //     ) {
// //       if (input.checkValidity && !input.checkValidity()) {
// //         plainInputsValid = false;
// //         return;
// //       }
// //     });
// //     if (!plainInputsValid) {
// //       triggerBrowserValidation();
// //       return;
// //     }
// //     example.classList.add('submitting');
// //     disableInputs();
// //     var name = form.querySelector('#example2-name');
// //     var address_id=form.querySelector('#example2-city');
// //     // var cvc = form.querySelector('#example2-card-cvc');
// //     var cvc=document.getElementsByName("cvc").contentWindow;
// //     // var number = form.querySelector('#example2-card-number');
// //     var number=document.getElementsByName("cardnumber").contentWindow;
// //     // var expiry = form.querySelector('#example2-card-expiry');
// //     var expiry=document.getElementsByName("exp-date").contentWindow;
// //     // var number=window.frames['__privateStripeFrame3'].document.getElementsByName("cardnumber");
// //
// //     var zip = form.querySelector('#example2-zip');
// //     var additionalData = {
// //       name: name ? name.value : undefined,
// //       zip: zip ? zip.value : undefined,
// //     };
// //    console.log(address_id.value)
// //     stripe.createToken(elements[0], additionalData).then(function(result) {
// //       example.classList.remove('submitting');
// //       if (result.token) {
// //         var source=result.token.id,
// //             exp_month=result.token.card.exp_month,
// //             exp_year=result.token.card.exp_year,
// //             card_last4=result.token.card.last4,
// //             cvc=result.token.card.cvc_checked,
// //             token = getCookie('token')
// //         console.log(result.token)
// //
// //         var xmlhttp;
// //         if(window.XMLHttpRequest){
// //           xmlhttp=new XMLHttpRequest();
// //         }else{
// //           xmlhttp=new ActiveXObject("Microsoft.XMLHTTP");
// //         }
// //         xmlhttp.onreadystatechange=function(){
// //           if (xmlhttp.readyState==4 && xmlhttp.status==200){
// //             console.log(xmlhttp.responseText)
// //           }
// //         }
// //         exp_year = exp_year.toString();
// //         exp_month = exp_month.toString();
// //         var number = "4242424242424242";
// //         var cvc = "123";
// //         var a = getCookie('token');
// //         console.log(typeof a,typeof name.value,typeof number,typeof cvc,typeof exp_month,typeof exp_year,typeof address_id.value,typeof source)
// //         console.log(a,name.value,number,cvc,exp_month,exp_year,address_id.value,source)
// //         xmlhttp.open("post","http://spore.zertone2.com/app/card/saveCard",true)
// //         xmlhttp.send({
// //           token:a,
// //           name: name.value,
// //           number: number,
// //           cvc: cvc,
// //           exp_month: exp_month,
// //           exp_year:exp_year,
// //           address_id: address_id.value,
// //           source:source
// //         })/**/
// //
// //          // location.reload()
// //       } else {
// //         enableInputs();
// //       }
// //     });
// //   });
// // }
// //
// //   export {stripe,elements,inputs,elementStyles,elementClasses,cardNumber,cardExpiry,cardCvc};
// // Create a Stripe client.
// var stripe = Stripe('pk_test_QOanbaN1OiMxIP2OfS8AxK0D');
//
// // Create an instance of Elements.
// var elements = stripe.elements();
//
// // Custom styling can be passed to options when creating an Element.
// // (Note that this demo uses a wider set of styles than the guide below.)
// var style = {
//   base: {
//     color: '#32325d',
//     lineHeight: '18px',
//     fontFamily: '"Helvetica Neue", Helvetica, sans-serif',
//     fontSmoothing: 'antialiased',
//     fontSize: '16px',
//     '::placeholder': {
//       color: '#aab7c4'
//     }
//   },
//   invalid: {
//     color: '#fa755a',
//     iconColor: '#fa755a'
//   }
// };
//
// // Create an instance of the card Element.
// var card = elements.create('card', {style: style});
//
// // Add an instance of the card Element into the `card-element` <div>.
// card.mount('#card-element');
//
// // Handle real-time validation errors from the card Element.
// card.addEventListener('change', function(event) {
//   var displayError = document.getElementById('card-errors');
//   if (event.error) {
//     displayError.textContent = event.error.message;
//   } else {
//     displayError.textContent = '';
//   }
// });
//
// // Handle form submission.
// var form = document.getElementById('payment-form');
// form.addEventListener('submit', function(event) {
//   event.preventDefault();
//
//   stripe.createToken(card).then(function(result) {
//     if (result.error) {
//       // Inform the user if there was an error.
//       var errorElement = document.getElementById('card-errors');
//       errorElement.textContent = result.error.message;
//     } else {
//       // Send the token to your server.
//       alert(card.id);
//     }
//   });
// });
// var stripe = Stripe('pk_test_QOanbaN1OiMxIP2OfS8AxK0D');

function stripeResponseHandler(status, response) {
console.log(response);
setSession("checkCard",response);
}
export {stripeResponseHandler};
