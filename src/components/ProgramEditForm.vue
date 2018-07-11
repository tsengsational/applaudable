<template>
    <div class="program-form" >
        <button class="back btn" @click.prevent="handleBack" >
            <font-awesome-icon icon="arrow-left" ></font-awesome-icon>
        </button>
        <h2>Edit Program</h2>
        <form class="info" >
            <label for="title">Title</label>
            <input type="text" name="title" :value="program.title" @change="handleChange" >
            <label for="hide_title">Hide Title?:</label>
            <input type="checkbox" name="hide_title" :value="program.hide_title" class="checkbox" @change="handleChange" >
            <label for="subtitle">Sub-Title</label>
            <input type="text" name="subtitle" :value="program.subtitle" @change="handleChange" >
            <label for="image" class="art-label">
                Program Art
            </label>
            <span v-if="noImage" >
                <div class="main-upload-container" v-if="showImageUpload">
                    <input class="image-upload" type="file" name="image" @change="handleFileSelect" >
                    <button v-if="showMainUploadBtn" class="image-upload-btn" @click.prevent="handleUploadClick" >upload</button>
                </div>
                <div class="main-image-uploaded-container" >
                    <span class="uploaded-filename" v-if="showUploadSuccess" >
                        {{mainUploadedFilename}}
                    </span><button class="image-upload-cancel" @click.prevent="handleUploadCancel" v-if="showUploadSuccess">x</button>
                </div>
            </span>
            <div class="art-image" :style="artStyle" v-if="program.image" >
                <button class="image-trash" @click.prevent="handleImageDelete" ><font-awesome-icon icon="trash-alt"></font-awesome-icon> </button>
            </div>
        </form>
        <div class="organization">
            <h4>Organization</h4>
            <div class="org-select-container">
                <select name="organization" @change="handleSelectChange" :value="organization" >
                    <option value="" disabled selected>Select Your Organization</option>
                    <option v-for="(organization, key) in organizations" :key="key" :value="key">{{organization.name}}</option>
                </select>
            </div>
        </div>
        <button class="program-submit" @click.prevent="handleSubmit" >Save</button>
    </div>
    
</template>

<script>
import {db, auth, storage} from '../main'

export default {
    components: {
    },
    props: ['user'],
    data: function() {
        return {
            program: {},
            organizations: [],
            organization: null,
            main_file: null,
            showImageUpload: true,
            mainUploadedFilename: null,
        }
    },
    computed: {
        showMainUploadBtn: function() {
            return this.main_file ? true : false;
        },
        showUploadSuccess: function() {
            return !this.showImageUpload
        },
        artStyle: function() {
            return {
                backgroundImage: `url(${this.program.image})`
            }
        },
        noImage: function() {
            return this.program.image ? false : true;
        },
        storedImagePath: function() {
            let url = this.program.image
            let rawPath = url.substring(url.indexOf("images"), url.indexOf("?alt")).trim()
            let path = rawPath.replace(/%2F/g, '/')
            return path
        }
    },
    firestore () {
        return {
            program: db.collection('programs').doc(this.$route.params.id),
            organizations: db.collection("users").doc(this.user.uid.toString()).collection("organizations"),
        }
    },
    watch: {
        program: function(newState, oldState) {
            console.log("created with", uid)
            const uid = newState.uid
            if (auth.currentUser.uid !== uid) {
                this.$router.push('/login')
                console.log("wrong user!")
            } else {
                console.log("correct user!")
            }
        },
        organizations: function(newState, oldState) {
            if (this.program.org_id) {
                const orgId = this.program.org_id
                const selectedIndex = newState.findIndex((el) => {
                    return el.id === orgId
                })
                this.organization = selectedIndex
            }
        }
    },
    methods: {
        handleBack: function() {
            this.$router.go(-1)
        },
        handleChange: function(event) {
            const key = event.target.name
            const type = event.target.type
            let value = null
            if (type === "checkbox") {
               value = event.target.checked === true ? true : false
            } else if (type === "number") {
                value = parseInt(event.target.value)
            }
            else {
                value = event.target.value
            }
            this.program[key] = value
        },
        handleFileSelect: function(event) {
            const file = event.target.files[0]
            this.main_file = file
        },
        handleImageDelete: async function () {
            const progId = this.$route.params.id
            const storageRef = storage.ref()
            const fileRef = storageRef.child(this.storedImagePath)
            const del = await fileRef.delete()
            this.program.image = null
            const update = await db.collection("programs").doc(progId).set(
                {image: null},
                {merge: true}
            )

        },
        handleSelectChange: function(event) {
            const key = event.target.name
            const value = event.target.value
            this[name] = value
            const orgId = this.organizations[value].id
            this.program.org_id = orgId
        },
        handleUploadClick: function(event) {
            const ref = storage.ref()
            const name = (+new Date()) + '-' + this.main_file.name;
            const uid = auth.currentUser.uid
            const path = "images/" + uid + "/" + name
            this.imagePath = path
            const metadata = {
            contentType: this.main_file.type
            };
            const task = ref.child(path).put(this.main_file, metadata);
            task
                .then(snapshot => snapshot.ref.getDownloadURL())
                .then((url) => {
                    this.program.image = url
                    this.showImageUpload = false;
                    this.mainUploadedFilename = this.main_file.name;
                    console.log(this.program.image);
                })
                .catch(console.error);
        },
        handleSubmit: function() {
            const currentUser = auth.currentUser
            const uid = currentUser.uid
            const progId = this.$route.params.id
            db.collection("programs")
                .doc(progId)
                .set(this.program)
                .then(() => {
                    console.log("added to firestore")
                    this.$router.go(-1)
                })
                .catch(error => console.log(error))
        }
    }
}
</script>

<style lang="scss">
@import '../assets/settings.scss';

.program-form {
    font-family: $body-font;
    font-size: 14px;
    text-align: left;
    width: 90%;
    position: relative;
    left: 5%;

    .back {
        width: 50px;
        height: 50px;
        margin-bottom: 16px;
        position: relative;
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

    .info {
        margin-bottom: 16px;
    }

    .hide {
        display:none;
    }
    .main-upload-container {
        display:inline;
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
        padding-right: 5px;
        &.about {
            vertical-align: top;
            padding-top: 5px;
        }
        &.funder-text {
            vertical-align: top;
            padding-top: 5px;
        }
        &.art-label {
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

    .main-image-uploaded-container {
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

    .image-upload-btn {
        position: relative;
        left: calc(100% - 100px);
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
    .art-image {
        display: inline-block;
        width: 75%;
        height: 300px;
        background-position: center;
        background-repeat: no-repeat;
        background-size:cover;
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
    .organization {
        .org-select-container {
            select {
                    appearance: none;
                    background-color: transparent;
                    border: 1px solid $gray;
                    font-family: $body-font;
                    font-size: 14px;
                    font-weight: 300;
                    padding-left: 15px;
                    cursor: pointer;
                    height: 34px;
                    margin-bottom: .75rem;
                    width: 75%;
                    user-select: none;
                    z-index: 3;
                    position: relative;
                    left: 25%;
                    -ms-user-select: none;
                    -moz-user-select: none;
                    -moz-appearance: none;
                    -webkit-user-select: none;
                    -webkit-appearance: none;
            }
        }
    }

    button.program-submit {
        margin-top: 16px;
        display: block;
        position: relative;
        left: calc(50% - 75px);
        width: 150px;
        height: 40px;
        background-color: $gray;
        border: none;
        font-family: $body-font;
        font-size: 14px;
        font-weight: 900;
        text-transform: uppercase;
        color: $white;
        transition: background-color .3s, color .3s;
        &:hover {
            background-color: $yellow;
            color: $black;
        }
    }
}

@media (min-width: 500px) {
    .program-form {
        width: 50%;
        position: relative;
        left: 25%;
    }
}

@media(min-width: 1000px ) {
    .program-form {
        width: 720px;
        left: calc(50% - (720px/2))
    }
}
</style>
