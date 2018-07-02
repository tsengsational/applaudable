k<template>
    <div class="org-form">
        <h2>Add Organization</h2>
        <form class="org">
            <label for="name">
                Name:
            </label>
            <input type="text" placeholder="e.g. Something Productions" name="name" @change="handleChange">
            <label class="about" for="about">
                About:
            </label>
            <textarea name="about" @change="handleChange" placeholder="e.g. Mission statement, general information, etc." />
            <label for="image">
                Logo/Image
            </label>
            <div class="image-upload-input-container" :class="{hide: imageUploaded}">
                <input class="image-upload" type="file" name="image" @change="handleFileSelect" >
                <button class="image-upload-btn" :class="{hide: hideUploadBtn}" @click.prevent="handleUploadClick" >upload</button>
            </div>
            <div class="image-uploaded-container" >
                <span class="uploaded-filename" :class="{hide: hideUploaded}" >
                    {{uploadedFilename}}
                </span><button class="image-upload-cancel" @click.prevent="handleUploadCancel" :class="{hide: hideUploaded}">x</button>
            </div>
        </form>
        <h4>Staff</h4>
        <form class="staff" v-for="(staff, key) in staffArr" :key="key">
            <label :for="ArrName(key)">
                Name: 
            </label>
            <input type="text" :name="ArrName(key)" placeholder="Jane Doe" @change="handleStaffChange" >
            <label :for="ArrRole(key)">
                Role: 
            </label>
            <input type="text" :name="ArrRole(key)" placeholder="Executive Director" @change="handleStaffChange" >
        </form>
        <div class="staff-controls" >
            <button class="add-staff" @click="handleStaffClick('add')" ><span>+</span></button>
            <button class="subtract-staff" @click="handleStaffClick('subtract')" ><span>-</span></button>
        </div>
        <button class="org-submit" @click.prevent="handleSubmit" >Submit</button>
    </div>
</template>

<script>
import {auth, db, storage} from '../main'

export default {
    data: function() {
        return {
            staffArr: [0],
            name: null,
            about: null,
            file: null,
            staff: [{name: null, role: null}],
            uploadedFilename: "",
            imageUploaded: false,
            imageUrl: null,
            imagePath: null,
        }
    },
    computed: {
        hideUploadBtn: function() {
            if (this.file) {
                return false
            } else {
                return true
            }
        },
        hideUploaded: function() {
            return !this.imageUploaded
        }
    },
    methods: {
        ArrName: function(index) {
            return "staff-name-" + index.toString()
        },
        ArrRole: function(index) {
            return "staff-role-" + index.toString()
        },
        handleStaffClick: function(type) {
            let emptyStaff = {name: null, role: null}
            if (type === "add") {
                this.staffArr.push(0)
                this.staff.push(emptyStaff)
            } else {
                this.staffArr.pop()
                this.staff.pop()
            }
        },
        handleFileSelect: function(event) {
            const file = event.target.files[0]
            this.file = file
        },
        handleChange: function(event) {
            const key = event.target.name
            this[key] = event.target.value
        },
        handleStaffChange: function(event) {
            const nameArr = event.target.name.split('-')
            const key = nameArr[1]
            const index = parseInt(nameArr[2])
            const value = event.target.value
            this.staff[index][key] = value
        },
        handleSubmit: function() {
            let data = {
                staff: this.staff,
                name: this.name,
                about: this.about,
                imagePath: this.imagePath,
                imageUrl: this.imageUrl,
            }
            const currentUser = auth.currentUser
            const uid = currentUser.uid
            db.collection("users")
                .doc(`${uid}`)
                .collection("organizations")
                .add({
                    name: data.name,
                    about: data.about,
                    image: data.imageUrl,
                    imagePath: data.imagePath
                })
                .then(org => {
                    const docId = org.id
                    const pathName = `staff`
                    return org.collection(pathName)
                })
                .then(collRef => {
                    let batch = db.batch()
                    data.staff.forEach((member, index) => {
                        const staffId = (+new Date()).toString() + "-" + index.toString()
                        const ref = collRef.doc(staffId)
                        const payload = {
                            name: member.name,
                            role: member.role,
                            index: index
                            }
                        batch.set(ref, payload)
                        })
                    return batch.commit();
                })
                .then(() => {
                    console.log("added to firestore")
                })
                .catch(error => console.log(error))
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
                    console.log(this.imageUrl);
                })
                .catch(console.error);
        },
        handleUploadCancel: function() {
            const ref = storage.ref()
            const imageRef = ref.child(this.imagePath)
            imageRef.delete()
                .then(() => {
                    this.imageUrl = null
                    this.file = null
                    const imageInput = document.querySelector('input.image-upload')
                    imageInput.value = null
                    this.imageUploaded = false
                    this.uploadedFilename = null
                    console.log("image deleted")
                })
                .catch(console.error);
        }
    }
    
}
</script>

<style lang="scss">
@import '../assets/settings.scss';

.org-form {
    font-family: $body-font;
    font-size: 14px;
    text-align: left;
    .hide {
        display:none;
    }
    input {
        font-family: $body-font;
        font-size: 14px;
        width: 75%;
        box-sizing: border-box;
        margin-bottom: 16px;
        border: 1px $gray solid;
        padding: 5px 10px;
    }
    label {
        display: inline-block;
        width: 25%;
        box-sizing: border-box;
        &.about {
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

    }
    .image-upload-input-container {
        display: inline;
        &.hide {
            display: none;
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

    .staff-controls {
        text-align: right;
    }

    button.add-staff, button.subtract-staff {
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

    button.add-staff {
        margin-right: 10px;
    }

    button.subtract-staff span {
        position: relative;
        bottom: 2px;
    }

    button.org-submit {
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
</style>
