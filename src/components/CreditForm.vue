<template>
    <div :class="className" >
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
            <label for="image">
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
        </form>
    </div>
</template>

<script>
import {storage, auth} from "../main"

export default {
    data: function() {
        return {
            imagePath: null,
            file: null,
            uploadedFilename: null,
            imageUploaded: false,
            showUploadInput: true,
        }
    },
    props: ['index', 'type'],
    computed: {
        className: function() {
            return `credit-form-${this.index}`
        },
        showUploadBtn: function() {
            return this.file ? true : false
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
            const value = event.target.value
            const index = this.index
            const type = this.type
            this.$emit("credit-change", [type, key, value, index])
            console.log("handling change:", value)
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
                        this.imageUrl, this.index, this.type
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
        }
    }
}
</script>

<style lang="scss">
@import '../assets/settings.scss';

    .credit-inputs {
        margin-bottom: 32px;
        label.bio {
            vertical-align: top;
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
</style>
