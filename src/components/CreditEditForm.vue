<template>
    <div class="credit-edit-container" >
        <button class="back btn" @click.prevent="handleBack" >
            <font-awesome-icon icon="arrow-left" ></font-awesome-icon>
        </button>
        <form class="credit-inputs" >
            <label for="name">
                Name: 
            </label>
            <input type="text" name="name" :value="credit.name" placeholder="Jane Doe" @change="handleChange" >
            <label for="role">
                Role: 
            </label>
            <input type="text" name="role" :value="credit.role" placeholder="e.g. Lady MacBeth, Director, Playwright, etc." @change="handleChange" >
            <label for="credited_role">
                Credited Role: 
            </label>
            <input type="text" name="credited_role" :value="credit.credited_role" placeholder="e.g. Lady MacBeth, Directed By, Written By, etc." @change="handleChange" >
            <label class="bio" for="bio">
                Bio:
            </label>
            <textarea name="bio" @change="handleChange" :value="credit.bio" placeholder="e.g. Jane Doe is pleased to be making her debut performance of... etc." />
            <label for="featured">Featured?:</label>
            <input type="checkbox" name="featured" :value="credit.featured" :checked="credit.featured" class="checkbox" @change="handleChange" >
            <label for="link">
                Link: 
            </label>
            <input type="text" name="link" :value="credit.link" placeholder="http://www.someplace.com" @change="handleChange" >
            <label for="image">
                Headshot:
            </label>
            <span class="image-upload-container" v-if="noImage">
                <div class="image-upload-input-container" v-if="showUploadInput">
                    <input class="image-upload" type="file" name="image" @change="handleFileSelect" >
                    <button class="image-upload-btn btn" v-if="showUploadBtn" @click.prevent="handleUploadClick" >upload</button>
                </div>
                <div class="image-uploaded-container" >
                    <span class="uploaded-filename" v-if="imageUploaded" >
                        {{uploadedFilename}}
                    </span><button class="image-upload-cancel" @click.prevent="handleUploadCancel" v-if="imageUploaded">x</button>
                </div>
            </span>
            <div class="headshot-image" :style="headshotStyle" v-if="credit.image" >
                <button class="image-trash" @click.prevent="handleImageDelete" ><font-awesome-icon icon="trash-alt"></font-awesome-icon> </button>
            </div>
            <button class="save-btn" @click.prevent="handleSave"  >Save</button>
        </form>
    </div>
</template>

<script>
import {storage, auth, db} from "../main.js";

export default {
    data: function() {
        return {
            credit: {name: null, role: null, credited_role: null, bio: null, image: null, link: null, featured: null, },
            imagePath: null,
            file: null,
            uploadedFilename: null,
            imageUploaded: false,
            showUploadInput: true,
        }
    },
    props: [],
    firestore() {
        return {
            credit: db.collection('programs').doc(this.$route.params.programId).collection(this.$route.params.creditType).doc(this.$route.params.id)
        }
    },
    computed: {
        className: function() {
            return `credit-form-${this.index}`
        },
        showUploadBtn: function() {
            return this.file ? true : false
        },
        headshotStyle: function() {
            return {
                backgroundImage: `url(${this.credit.image})`
            }
        },
        type: function () {
            return this.$route.params.creditType
        },
        noImage: function() {
            return this.credit.image ? false : true;
        }
    },
    watch: {
        imageUploaded: function(newState, oldState){
            this.showUploadInput = !newState
        }
    },
    methods: {
        handleBack: function() {
            this.$router.go(-1)
        },
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
            this.credit[key] = value
            console.log("handling change:", value)
        },
        handleFileSelect: function(event) {
            const file = event.target.files[0]
            this.file = file
        },
        handleImageDelete: function(event) {
            const ref = storage.ref()
            const imageRef = ref.child(this.credit.imagePath)
            imageRef.delete()
                .then(() => {
                    this.credit.imagePath = null
                    this.credit.image = null
                })
                .catch(console.error)
            const creditRef = db.collection("programs").doc(this.$route.params.programId).collection(this.$route.params.crediType).doc(this.route.params.id)
            const payload = {
                image: null,
                imagePath: null
            }
            credRef.set(payload, {merge: true})
        },
        handleSave: function(event) {
            const creditRef = db.collection("programs").doc(this.$route.params.programId).collection(this.$route.params.creditType).doc(this.$route.params.id)
            const payload = this.credit
            debugger
            creditRef.set(payload)
            this.$router.go(-1)
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
                    this.credit.image = this.imageUrl
                    this.credit.imagePath = this.imagePath
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
        }
    }
}
</script>

<style lang="scss">
@import '../assets/settings.scss';

div.credit-edit-container {
    padding-top: 32px;
    margin-bottom: 16px;
    border: 0px $gray solid;
    padding: 32px 0;
    border-radius: 10px;
    box-shadow: 0;
    font-family: $body-font;
    text-align: left;

    .back {
        width: 50px;
        height: 50px;
        margin-bottom: 16px;
        position: relative;
        left: 5%;
    }

    .btn {
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

    .credit-inputs {    
        width: 90%;
        height: 90%;
        position: relative;
        top: 5%;
        left: 5%;
        background-color: $white;


        .image-upload-btn {
            position: relative;
            left: calc(100% - 100px);
            display: block;
            width: 100px;
            height: 40px;

        }

        .save-btn {
            margin-top: 16px;
            position: relative;
            left: calc(50% - 50px);
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

        input {
        font-family: $body-font;
        font-size: 14px;
        width: 75%;
        box-sizing: border-box;
        margin-bottom: 16px;
        border: 1px $gray solid;
        padding: 5px 10px;
        &.checkbox {
            width: calc(75% - 10px);
            height: 20px;
            }
        }
        label {
            display: inline-block;
            width: 25%;
            box-sizing: border-box;
            &.about {
                vertical-align: top;
                padding-top: 5px;
            }
            &.funder-text {
                vertical-align: top;
                padding-top: 5px;
            }
        }
        textarea {
            font-family: $body-font;
            font-size: 14px;
            padding: 5px 10px;
            width: 75%;
            box-sizing: border-box;
            height: 8em;
            margin-bottom: 16px;
            border: 1px $gray solid;
        }
        .image-upload-input-container {
            display: inline;
            &.hide {
                display: none;
            }
        }

        label.bio {
            vertical-align: top;
        }
        .headshot-image {
            width: 75%;
            height: 300px;
            background-position: center;
            background-repeat: no-repeat;
            background-size:cover;
            left: 25%;
            position: relative;
            .image-trash {
                color: $white;
                font-size: 14px;
                width: 30px;
                height: 30px;
                border-radius: 50%;
                position: absolute;
                bottom: 10px;
                right: 10px;
                border: 1px $gray solid;
                background-color: $gray;
                padding-left: 8px;
                transition: border .3s, background-color .3s, color .3s;
                &:hover {
                    color: $black;
                    background-color: $yellow;
                    border: 1px $yellow solid;
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
    }
}
</style>
