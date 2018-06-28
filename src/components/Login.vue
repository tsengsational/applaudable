<template>
    <div class="login-container">
        <div class="login" :class="{ hide: hideLogin }" >
            <h3>
                Log in
            </h3>
            <form action="" @submit="logIn" >
                <input class="email" type="text" placeholder="E-mail">
                <input class="password" type="password" placeholder="Password">
                <button  >Log in</button>
            </form>
            <a @click="toggleHide" >Want to create an account?</a>
            <img src="https://developers.google.com/identity/images/btn_google_signin_dark_normal_web.png" alt="google-sign-in" class="google" @click="googleSignIn" >
        </div>
        <div class="sign-in" :class="{ hide: hideSignUp }">
            <h3>
                Sign up
            </h3>
            <form action="" @submit="signUp" >
                <input class="email" type="text" placeholder="E-mail">
                <input class="password" type="password" placeholder="Password">
                <button  >Sign up</button>
            </form>
            <a @click="toggleHide" >Already have an account?</a>
        </div>
    </div>
</template>

<script>
import { auth } from '../main';
import firebase from 'firebase/app'
import 'firebase/auth'

var googleProvider = new firebase.auth.GoogleAuthProvider();

export default {
    data: function() {
        return {
            hideLogin: false
        }
    },
    computed: {
        hideSignUp: function() {
            return !this.hideLogin;
        }
    },
    methods: {
        signUp: function(event) {
            event.preventDefault()
            let email = event.target[0].value
            let password = event.target[1].value
            console.log(email, password)
            auth.createUserWithEmailAndPassword(email, password).catch(function(error) {
                // Handle Errors here.
                var errorCode = error.code;
                var errorMessage = error.message;
                // ...
            });     
        },
        logIn: function(event) {
            let email = event.target[0].value
            let password = event.target[1].value
            auth.signInWithEmailAndPassword(email, password).catch(function(error) {
            // Handle Errors here.
            var errorCode = error.code;
            var errorMessage = error.message;
            // ...
            });
        },
        googleSignIn: function() {
            auth.signInWithPopup(googleProvider).then(function(result) {
            // This gives you a Google Access Token. You can use it to access the Google API.
            var token = result.credential.accessToken;
            // The signed-in user info.
            var user = result.user;
            // ...
            console.log(token, user)
            }).catch(function(error) {
            // Handle Errors here.
            var errorCode = error.code;
            var errorMessage = error.message;
            // The email of the user's account used.
            var email = error.email;
            // The firebase.auth.AuthCredential type that was used.
            var credential = error.credential;
            // ...
});
        },
        toggleHide: function() {
            this.hideLogin = !this.hideLogin
        }
    }
    
}
</script>

<style lang="scss">
    @import "../assets/settings.scss";

    .login-container {
        width: 400px;
        height: 400px;
        position: relative;
        top: calc((50vh - 60px) - 150px);
        left: calc(50vw - 200px);
        overflow: hidden;
        transform: translateX(0px);
        .login, .sign-in {
            width: 400px;
            position: absolute;
            transition: transform .6s;
            &.hide {
                transform: translateX(400px);
            }
            form {
                input {
                    display: block;
                    width: 390px;
                    height: 40px;
                    font-family: $body-font;
                    font-size: 14px;
                    box-sizing:border-box;
                    padding-left: 16px;
                    margin-bottom: 16px;
                    border: 1px $gray solid;
                }
                button {
                    width: 150px;
                    height: 40px;
                    background-color: $gray;
                    border: 0;
                    font-family: $body-font;
                    font-size: 14px;
                    font-weight: 900;
                    text-transform: uppercase;
                    color: $white;
                    transition: background-color .3s;
                    &:hover {
                        background-color: $yellow;

                    }
                }
            }
            .google {
                display: block;
                cursor: pointer;
                position: relative;
                margin-top: 16px;
                left: calc(200px - (191px/2));
            }
        }
        a {
            font-family: $body-font;
            font-size: 12px;
            color: $gray;
            cursor: pointer;
            &:hover {
                color: $yellow;
            }
        }
    }
</style>


