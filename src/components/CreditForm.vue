<template>
    <div :class="className" >
        <div class="credit-container" :class="{add: addCreditForm}" >
            <form class="credit-inputs" >
                <label for="name">
                    Name: 
                </label>
                <input type="text" name="name" placeholder="Jane Doe" @change="handleChange" >
                <label for="role">
                    Role: 
                </label>
                <input type="text" name="role" placeholder="e.g. Lady MacBeth, Director, Playwright, etc." @change="handleChange" >
                <label for="credited_role">
                    Credited Role: 
                </label>
                <input type="text" name="credited_role" placeholder="e.g. Lady MacBeth, Directed By, Written By, etc." @change="handleChange" >
                <label class="bio" for="bio">
                    Bio:
                </label>
                <textarea name="bio" @change="handleChange" placeholder="e.g. Jane Doe is pleased to be making her debut performance of... etc." />
                <label for="featured">Featured?:</label>
                <input type="checkbox" name="featured" value="true" class="checkbox" @change="handleChange" >
                <label for="link">
                    Link: 
                </label>
                <input type="text" name="link" placeholder="http://www.someplace.com" @change="handleChange" >
                <label for="image" class="headshot">
                    Headshot:
                </label>
                <div class="image-upload-input-container" v-if="showUploadInput">
                    <input class="image-upload" type="file" name="image" @change="handleFileSelect" >
                    <button class="image-upload-btn" v-if="showUploadBtn" @click.prevent="handleUploadClick" >upload</button>
                </div>
                <div class="image-uploaded-container" >
                    <span class="uploaded-filename" v-if="imageUploaded" >
                        {{uploadedFilename}}
                    </span><button class="image-upload-cancel" @click.prevent="handleUploadCancel" v-if="imageUploaded">x</button>
                </div>
                <label for="imageAlt" class="image-alt">
                    Alternate Image Text (optional): 
                </label>
                <input type="text" name="imageAlt" placeholder="Headshot of an Actor" @change="handleChange" >
                <button class="submit-btn" @click.prevent="handleSubmit" v-if="addCreditForm" >Submit</button>
            </form>
        </div>
    </div>
</template>

<script>
import {storage, auth, db} from "../main"
import ShortId from 'shortid'

export default {
    data: function() {
        return {
            imagePath: null,
            file: null,
            uploadedFilename: null,
            imageUploaded: false,
            showUploadInput: true,
            credit: {
                featured: false
            }
        }
    },
    props: ['index', 'type'],
    computed: {
        className: function() {
            return `credit-form-${this.index}`
        },
        showUploadBtn: function() {
            return this.file ? true : false
        },
        addCreditForm: function() {
            return this.$route.params.type ? true : false;
        }
    },
    watch: {
        imageUploaded: function(newState, oldState){
            this.showUploadInput = !newState
        }
    },
    methods: {
        handleChange: function (event) {
            const key = event.target.name
            const inputType = event.target.type
            let value = null
                if (inputType === "checkbox") {
                   value = event.target.checked
                } else if (inputType === "number") {
                    value = parseInt(event.target.value)
                } 
                else {
                    value = event.target.value
                }
            if (this.addCreditForm) {
                this.credit[key] = value
            } else {
                const index = this.index
                const type = this.type
                this.$emit("credit-change", [type, key, value, index])
                console.log("handling change:", value)
            }
        },
        handleFileSelect: function(event) {
            const file = event.target.files[0]
            this.file = file
        },
        handleUploadClick: function(event) {
            const ref = storage.ref()
            const name = (+new Date()) + '-' + this.file.name;
            const uid = auth.currentUser.uid
            const path = "images/" + uid + "/" + name
            this.imagePath = path
            const metadata = {
            contentType: this.file.type
            };
            const task = ref.child(path).put(this.file, metadata);
            task
                .then(snapshot => snapshot.ref.getDownloadURL())
                .then((url) => {
                    this.imageUrl = url
                    this.imageUploaded = true;
                    this.uploadedFilename = this.file.name;
                    this.$emit("image-upload", [
                        this.imageUrl, this.index, this.type, this.imagePath
                    ])
                })
                .catch(console.error);
        },
        handleUploadCancel: function() {
            const ref = storage.ref()
            const imageRef = ref.child(this.imagePath)
            imageRef.delete()
                .then(() => {
                    this.file = null
                    const imageInput = document.querySelector(`.credit-form-${this.index} input.image-upload`)
                    imageInput.value = null
                    this.imageUploaded = false
                    this.uploadedFilename = null
                    this.$emit('image-cancel', [this.type, this.index])
                    console.log("image deleted")
                })
                .catch(console.error);
        },
        handleSubmit: function() {
            const id = this.$route.params.id
            const type = this.$route.params.type
            const creditId = ShortId.generate()
            const payload = {
                id: creditId,
                ...this.credit
            }
            db.collection("programs").doc(id).collection(type).doc(creditId).set(payload)
                .then(() => {
                    console.log("created", payload)
                    this.$router.go(-1)
                })
                .catch((error) => {
                    console.log(error)
                })
        }
    }
}
</script>

<style lang="scss">
@import '../assets/settings.scss';

    .credit-container {
        margin-bottom: 16px;
        border: 1px $gray solid;
        padding: 32px 0;
        border-radius: 10px;
        box-shadow: 0px 0px 10px $gray;
        font-family: $body-font;
        &.add {
            text-align: left;
            width: 50%;
            border: none;
            box-shadow: none;
            position: relative;
            left: 25%;
            .credit-inputs {
            label, input {
                display: inline-block;
            }
            label {
                width: 25%;
            }
            input, textarea {
                @include input(75%);
                box-sizing: border-box;
                margin: 0 0 16px 0;
                &.checkbox {
                    width: calc(75% - 10px);
                    height: 20px;
                }
            }
            }
        }

        .credit-inputs {
            width: 90%;
            height: 90%;
            position: relative;
            top: 5%;
            left: 5%;
            margin-bottom: 32px;
            label.bio, label.headshot {
                vertical-align: top;
            }
            label.image-alt {
                vertical-align: top;
            }
            .image-upload-input-container {
                display: inline-block;
                width: 75%;
                input.image-upload {
                    width: 100%;
                }
                .image-upload-btn {
                    position: relative;
                    right: 0%;
                    display: block;
                    width: 100px;
                    height: 40px;
                    border: 0;
                    background-color: $gray;
                    border: none;
                    font-family: $body-font;
                    text-align: center;
                    font-size: 14px;
                    font-weight: 900;
                    text-transform: uppercase;
                    color: $white;
                    opacity: 1;
                    margin-bottom: 16px;
                    transition: background-color .3s, opacity .6s, color .3s;
                    &.hide {
                        display: none;
                        opacity: 0;
                    }
                    &:hover {
                        background-color: $yellow;
                        color: $black;
                    } 
                }
            }
            .image-uploaded-container {
            display: inline;

            .uploaded-filename {
                display: inline-block;
                background-color: $yellow;
                padding: 5px 10px;
                height: 30px;
                box-sizing: border-box;
                border-radius: 10px;
                color: $black;
                &.hide {
                    display:none;
                }
            }
            button.image-upload-cancel {
                margin-left: 10px;
                width: 30px;
                height: 30px;
                border: 0;
                background-color: $gray;
                border: none;
                font-family: $body-font;
                text-align: center;
                font-size: 14px;
                font-weight: 900;
                text-transform: uppercase;
                color: $white;
                opacity: 1;
                transition: background-color .3s, opacity .6s, color .3s;
                &.hide {
                    display: none;
                    opacity: 0;
                }
                &:hover {
                    background-color: $yellow;
                    color: $black;
                } 
                }
                &.hide {
                    display: none;
                }
            }
            .submit-btn {
                @include button(100px, 40px, 16px);
                position: relative;
                left: calc(50% - 50px);
                top: 30px;
            }
        }
    }
</style>
