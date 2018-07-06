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
            <div class="alert" :class="{show: loginAlert} " >
                {{loginAlert}}
            </div>
        </div>
        <div class="sign-in" :class="{ hide: hideSignUp }">
            <h3>
                Sign up
            </h3>
            <form action="" @submit="signUp" >
                <input class="email" type="text" placeholder="E-mail">
                <input class="first-name" type="text" placeholder="First Name" >
                <input class="password" type="password" placeholder="Password">
                <button  >Sign up</button>
            </form>
            <a @click="toggleHide" >Already have an account?</a>
            <div class="alert" :class="{show: signUpAlert} " >
                {{signUpAlert}}
            </div>
        </div>
    </div>
</template>

<script>
import { auth, db } from '../main';
import firebase from 'firebase/app'
import 'firebase/auth'

var googleProvider = new firebase.auth.GoogleAuthProvider();

export default {
    data: function() {
        return {
            hideLogin: false,
            loginAlert: null,
            signUpAlert: null,
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
            let firstName = event.target[1].value
            let password = event.target[2].value
            console.log(email, firstName, password)
            auth.createUserWithEmailAndPassword(email, password)
                .then(() => {
                    console.log("updating:", firstName)
                    const user = auth.currentUser
                    user.updateProfile({
                        displayName: firstName
                    })
                        .then(() => {
                            console.log("updated:", auth.currentUser.displayName)
                            const uid = auth.currentUser.uid
                            const displayName = auth.currentUser.displayName
                            const email = auth.currentUser.email
                            db.collection('users').doc(`${uid}`).set(
                                {
                                    displayName,
                                    email
                                }
                            ).then(() => {
                                console.log("saved to database!")
                            }).catch((error) => {
                                const errorCode = error.code;
                                const errorMessage = error.message;
                                console.log(errorCode, errorMessage)
                            })
                        })
                        .catch((error)=>{
                            const errorCode = error.code;
                            const errorMessage = error.message;
                            console.log(errorCode, errorMessage)
                        } )
                })
                .catch((error) => {
                    const errorCode = error.code;
                    const errorMessage = error.message;
                    this.signUpAlert = errorCode + ": " + errorMessage
                });     
        },
        logIn: async function(event) {
            let email = event.target[0].value
            let password = event.target[1].value
            let user = await auth.signInWithEmailAndPassword(email, password)
            let newPath = null
            if (this.$route.query.redirect) {
                newPath = this.$route.query.redirect
            } else {
                newPath = '/'
            }
            this.$router.push(newPath)
                // .then(this.onLoginSuccess.bind(this))
                // .catch((error) => {
                // var errorCode = error.code;
                // var errorMessage = error.message;
                // this.loginAlert = errorCode + ": " + errorMessage;
                // });
        },
        googleSignIn: function() {
            auth.signInWithPopup(googleProvider)
                .then(function(result) {
                var token = result.credential.accessToken;
                var user = result.user;
                console.log(token, user)
                })
                .catch(function(error) {
                var errorCode = error.code;
                var errorMessage = error.message;
                var email = error.email;
                var credential = error.credential;
                console.log(errorCode, errorMessage, email, credential)
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
                    width: 100%;
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
            .alert {
                font-family: $body-font;
                font-weight: 900;
                margin-top: 10px;
                color: $yellow;
                opacity: 0;
                transition: opacity .6s;
                &.show {
                    opacity: 1;
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


