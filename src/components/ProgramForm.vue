<template>
    <div class="program-form" >
        <h2>New Program</h2>
        <form class="info" >
            <label for="title">Title</label>
            <input type="text" name="title" @change="handleChange" >
            <label for="hide_title">Hide Title?:</label>
            <input type="checkbox" name="hide_title" value="true" class="checkbox" @change="handleCheckbox" >
            <label for="subtitle">Sub-Title</label>
            <input type="text" name="subtitle" @change="handleChange" >
            <label for="image">
                Program Art
            </label>
            <div class="main-upload-container" v-if="showImageUpload">
                <input class="image-upload" type="file" name="image" @change="handleFileSelect" >
                <button v-if="showMainUploadBtn" class="image-upload-btn" @click.prevent="handleUploadClick" >upload</button>
            </div>
            <div class="main-image-uploaded-container" >
                <span class="uploaded-filename" v-if="showUploadSuccess" >
                    {{mainUploadedFilename}}
                </span><button class="image-upload-cancel" @click.prevent="handleUploadCancel" v-if="showUploadSuccess">x</button>
            </div>
        </form>
        <div class="credits-container">
            <div class="creative">  
                <h3>Creative Team</h3>
                <credit-form v-for="(credit, key) in creativeArr" :key="key" :index="key" @credit-change="handleCreditChange" @image-upload="handleCreditUpload" @image-cancel="handleCreditCancel" :type="'creative'"/>
                <div class="credits-controls" >
                    <button class="add-credit" @click.prevent="handleCreditClick('add', 'creative')" ><span>+</span></button>
                    <button class="subtract-credit" @click.prevent="handleCreditClick('subtract', 'creative')" ><span>-</span></button>
                </div>
            </div>
            <div class="cast" >
                <h3>Cast</h3>
                <credit-form v-for="(credit, key) in castArr" :key="key" :index="key" @credit-change="handleCreditChange" @image-upload="handleCreditUpload" @image-cancel="handleCreditCancel" :type="'cast'" />
                <div class="credits-controls" >
                    <button class="add-credit" @click.prevent="handleCreditClick('add', 'cast')" ><span>+</span></button>
                    <button class="subtract-credit" @click.prevent="handleCreditClick('subtract', 'cast')" ><span>-</span></button>
                </div>
            </div>
        </div>
        <div class="organization">
            <h4>Organization</h4>
            <div class="org-select-container">
                <select name="organization" @change="handleChange" >
                    <option value="" disabled selected>Select Your Organization</option>
                    <option v-for="(organization, key) in organizations" :key="key" :value="key">{{organization.name}}</option>
                </select>
            </div>
        </div>
        <div class="current-user" v-if="user" ></div>
        <button class="program-submit" @click.prevent="handleSubmit" >Submit</button>
    </div>
    
</template>

<script>
import {db, auth, storage} from '../main'
import CreditForm from './CreditForm'
import ShortId from 'shortid'

export default {
    components: {
        CreditForm
    },
    props: ['user'],
    data: function() {
        return {
            organizations: [],
            organization: {},
            title: null,
            main_file: null,
            showImageUpload: true,
            mainImageUrl: null,
            subtitle: null,
            mainUploadedFilename: null,
            creativeArr: [0],
            castArr: [0],
            hideTitle: null,
            creative: [{
                name: null,
                role: null,
                credited_role: null,
                featured: null,
                bio: null,
                image: null,
                link: null,
                imagePath: null,
                imageAlt: null
            }],
            cast: [{
                name: null,
                role: null,
                credited_role: null,
                featured: null,
                bio: null,
                image: null,
                link: null,
                imagePath: null,
                imageAlt: null
            }] 
        }
    },
    computed: {
        showMainUploadBtn: function() {
            return this.main_file ? true : false;
        },
        showUploadSuccess: function() {
            return !this.showImageUpload
        }
    },
    firestore () {
        return {
            organizations: db.collection("users").doc(this.user.uid.toString()).collection("organizations")
        }
    },
    methods: {
        handleCheckbox: function(event) {
            const value = event.target.checked
            this.hideTitle = value
        },
        handleCreditClick: function(action, type) {
                let emptyCredit = {name: null, role: null, credited_role: null, bio: null, link: null, image: null, featured: null}
            if (action === "add" && type === "creative") {
                this.creativeArr.push(0)
                this.creative.push(emptyCredit)
            } else if (action === "subtract" && type === "creative") {
                this.creativeArr.pop()
                this.creative.pop()
            } else if ( action === "add" && type === "cast") {
                this.castArr.push(0)
                this.cast.push(emptyCredit)
            } else if (action === "subtract" && type === "cast") {
                this.castArr.pop()
                this.creative.pop()
            }
        },
        handleChange: function(event) {
            const key = event.target.name
            const type = event.target.type
            let value = null
            if (type === "checkbox") {
               value = event.target.checked
            } else if (type === "number") {
                value = parseInt(event.target.value)
            } 
            else {
                value = event.target.value
            }
            this[key] = event.target.value
        },
        handleCreditChange: function(array){
            const type = array[0]
            const key = array[1]
            const value = array[2]
            const index = array[3]
            this[type][index][key] = value
        },
        handleCreditCancel: function(array) {
            const type = array[0]
            const index = array[1]
            if (this[type][index]) {
                this[type][index].image = null
            } else {
                console.log("there is no credit at index", index)
            }
        },
        handleCreditUpload: function(payload) {
            const url = payload[0]
            const index = payload[1]
            const type = payload[2]
            const path = payload [3]
            this[type][index].image = url
            this[type][index].imagePath = path
            console.log("uploaded image:", url)
        },
        handleFileSelect: function(event) {
            const file = event.target.files[0]
            this.main_file = file
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
                    this.mainImageUrl = url
                    this.showImageUpload = false;
                    this.mainUploadedFilename = this.main_file.name;
                    console.log(this.mainImageUrl);
                })
                .catch(console.error);
        },
        handleSubmit: function() {
            const created = new Date
            const id = ShortId.generate()

            let data = {
                uid: auth.currentUser.uid,
                title: this.title,
                hide_title: this.hideTitle,
                subtitle: this.subtitle,
                image: this.mainImageUrl,
                creative: this.creative,
                cast: this.cast,
                orgId: this.organizations[this.organization].id,
                created_at: created
            }
            const currentUser = auth.currentUser
            const uid = currentUser.uid
            db.collection("programs")
                .doc(id).set({
                    title: data.title,
                    hide_title: data.hide_title,
                    subtitle: data.subtitle,
                    image: data.image,
                    uid: uid,
                    org_id: data.orgId,
                    created_at: data.created_at,
                    id: id
                })
                .then(() => {
                    return db.collection("programs").doc(id).collection('creative')
                })
                .then(creativeRef => {
                    let batch = db.batch()
                    const program = creativeRef.parent
                    const castRef = program.collection('cast')
                    data.creative.forEach((credit, index) => {
                        if (credit.bio != null) {
                            const creditId = ShortId.generate()
                            const ref = creativeRef.doc(creditId)
                            const payload = {
                                name: credit.name,
                                role: credit.role,
                                credited_role: credit.credited_role,
                                featured: credit.featured,
                                image: credit.image,
                                link: credit.link,
                                bio: credit.bio,
                                index: index,
                                id: creditId,
                                imagePath: credit.imagePath,
                                imageAlt: credit.imageAlt 
                                }
                            batch.set(ref, payload)
                        }
                    })
                    data.cast.forEach((credit, index) => {
                        if (credit.bio != null) {
                            const creditId = ShortId.generate()
                            const ref = castRef.doc(creditId)
                            const payload = {
                                name: credit.name,
                                role: credit.role,
                                credited_role: credit.credited_role,
                                featured: credit.featured,
                                image: credit.image,
                                link: credit.link,
                                bio: credit.bio,
                                index: index,
                                imagePath: credit.imagePath,
                                imageAlt: credit.imageAlt
                                }
                            batch.set(ref, payload)
                        }
                    })
                    return batch.commit();
                })
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

    .credits-controls {
        text-align: right;
    }

    .credits-container {
        margin-bottom: 10px;
    }

    button.add-credit, button.subtract-credit {
        width: 30px;
        height: 30px;
        border: 0;
        background-color: $gray;
        border: none;
        font-family: $body-font;
        text-align: center;
        font-size: 24px;
        font-weight: 900;
        text-transform: uppercase;
        color: $white;
        transition: background-color .3s, color .3s;
        &:hover {
            background-color: $yellow;
            color: $black;
        }
    }

    button.add-credit {
        margin-right: 10px;
    }

    button.subtract-credit span {
        position: relative;
        bottom: 2px;
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
