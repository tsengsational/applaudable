<template>
    <div class="org-form">
        <button class="back btn" @click.prevent="handleBack" >
            <font-awesome-icon icon="arrow-left" ></font-awesome-icon>
        </button>
        <h2>Edit Organization</h2>
        <form class="org">
            <label for="name">
                Name:
            </label>
            <input type="text" placeholder="e.g. Something Productions" :value="organization.name" name="name" @change="handleChange">
            <label class="about" for="about">
                About:
            </label>
            <textarea name="about" @change="handleChange" :value="organization.about" placeholder="e.g. Mission statement, general information, etc." />
            <label class="art-label" for="image">
                Logo/Image
            </label>
            <span v-if="noImage">
                <div class="image-upload-input-container" :class="{hide: imageUploaded}">
                    <input class="image-upload" type="file" name="image" @change="handleFileSelect" >
                    <button class="image-upload-btn" :class="{hide: hideUploadBtn}" @click.prevent="handleUploadClick" >upload</button>
                </div>
                <div class="image-uploaded-container" >
                    <span class="uploaded-filename" :class="{hide: hideUploaded}" >
                        {{uploadedFilename}}
                    </span><button class="image-upload-cancel" @click.prevent="handleUploadCancel" :class="{hide: hideUploaded}">x</button>
                </div>
            </span>
            <div class="art-image" :style="imageStyle" v-if="organization.image" >
                <button class="image-trash" @click.prevent="handleImageDelete" ><font-awesome-icon icon="trash-alt"></font-awesome-icon> </button>
            </div>
        </form>
        <div class="staff-container">
            <h4>Staff</h4>
            <form class="staff" v-for="(staff, key) in staff" :key="key">
                <label :for="ArrName('staff', 'name', key)">
                    Name: 
                </label>
                <input type="text" :name="ArrName('staff', 'name', key)" :value="staff.name" placeholder="Jane Doe" @change="handleStaffChange" >
                <label :for="ArrName('staff', 'role', key)">
                    Role: 
                </label>
                <input type="text" :name="ArrName('staff', 'role', key)" :value="staff.role" placeholder="Executive Director" @change="handleStaffChange" >
            </form>
            <div class="staff-controls" >
                <button class="add-staff" @click="handleStaffClick('add')" ><span>+</span></button>
                <button class="subtract-staff" @click="handleStaffClick('subtract')" ><span>-</span></button>
            </div>
        </div>
        <div class="funder-container">
            <form class="funder-info">
            <h4>Funders</h4>
                <label for="funder_title" class="funder_title" >Title text</label>
                <input type="text" name="funder_title" :value="organization.funders.title_text" placeholder="Thank you to these donors" @change="handleChange" >
                <label for="funderText" class="funder_text">Funder Text</label>
                <textarea name="funder_text" :value="organization.funders.text" placeholder="e.g. We would like to thank the following donors..." @change="handleChange" ></textarea>
            </form>
            <div class="institutional" >
                <h5>Institutional funders:</h5>
                <form class="funders" v-for="(institution, key) in institutional" :key="key">
                    <label :for="ArrName('institutional', 'name', key)">
                        Name: 
                    </label>
                    <input type="text" :name="ArrName('institutional', 'name', key)" :value="institution.name" placeholder="Doe Family Fund" @change="handleFunderChange" >
                    <label :for="ArrName('institutional', 'amount_donated', key)">
                        Funding Level (no symbols e.g. $): 
                    </label>
                    <input type="number" :name="ArrName('institutional', 'amount_donated', key)" placeholder="e.g. 100" :value="institution.amount_donated" @change="handleFunderChange" >
                </form>
                <div class="funder-controls" >
                    <button class="add-staff" @click.prevent="handleFunderClick('add', 'institution')" ><span>+</span></button>
                    <button class="subtract-staff" @click.prevent="handleFunderClick('subtract', 'institution')" ><span>-</span></button>
                </div>
            </div>
            <div class="individual" >
                <h5>Individual funders:</h5>
                <form class="funders" v-for="(individual, key) in individual" :key="key">
                    <label :for="ArrName('individual', 'name', key)">
                        Name: 
                    </label>
                    <input type="text" :name="ArrName('individual', 'name', key)" :value="individual.name" placeholder="Doe Family Fund" @change="handleFunderChange" >
                    <label :for="ArrName('individual', 'amount_donated', key)">
                        Amount Donated: 
                    </label>
                    <input type="number" :name="ArrName('individual', 'amount_donated', key)" :value="individual.amount_donated" placeholder="e.g. 100" @change="handleFunderChange" >
                </form>
                <div class="funder-controls" >
                    <button class="add-staff" @click.prevent="handleFunderClick('add', 'individual')" ><span>+</span></button>
                    <button class="subtract-staff" @click.prevent="handleFunderClick('subtract', 'individual')" ><span>-</span></button>
                </div>
            </div>
        </div>
        <button class="org-submit" @click.prevent="handleSubmit" >Save</button>
    </div>
</template>

<script>
import {auth, db, storage} from '../main'

export default {
    data: function() {
        return {
            file: null,
            staff: [{name: null, role: null}],
            institutional: [{name: null, amount_donated: null}],
            individual: [{name: null, amount_donated: null}],
            organization: {funders: {text: null, title_text: null}},
            uploadedFilename: "",
            imageUploaded: false,
        }
    },
    props: ['user'],
    firestore () {
        return {
            organization: db.collection("users").doc(this.$route.params.uid).collection("organizations").doc(this.$route.params.id),
            institutional: db.collection("users").doc(this.$route.params.uid).collection("organizations").doc(this.$route.params.id).collection("institutional"),
            individual: db.collection("users").doc(this.$route.params.uid).collection("organizations").doc(this.$route.params.id).collection("individual"),
            staff: db.collection("users").doc(this.$route.params.uid).collection("organizations").doc(this.$route.params.id).collection("staff")
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
        },
        noImage: function () {
            return this.organization.image ? false : true;
        },
        imageStyle: function() {
            return {
                backgroundImage: `url(${this.organization.image})`
            }
        }
    },
    methods: {
        ArrName: function(type, subType, index) {
            return `${type}-${subType}-` + index.toString()
        },
        handleBack: function() {
            this.$router.go(-1)
        },
        handleStaffClick: function(type) {
            let emptyStaff = {name: null, role: null}
            if (type === "add") {
                this.staff.push(emptyStaff)
            } else {
                this.staff.pop()
            }
        },
        handleFileSelect: function(event) {
            const file = event.target.files[0]
            this.file = file
        },
        handleChange: function(event) {
            const key = event.target.name
            this.organization[key] = event.target.value
        },
        handleStaffChange: function(event) {
            const nameArr = event.target.name.split('-')
            const key = nameArr[1]
            const index = parseInt(nameArr[2])
            const value = event.target.value
            this.staff[index][key] = value
        },
        handleFunderClick: function(action, type) {
            let emptyFunder = {name: null, amount_donated: null, id: null}
            if (action === "add" && type === "institution") {
                this.institutional.push(emptyFunder)
            } else if (action === "subtract" && type ==="institution") {
                this.institutional.pop()
            } else if (action === "add" && type === "individual") {
                this.individual.push(emptyFunder)
            } else if (action === "subtract" && type ==="individual") {
                this.individual.pop()
            }
        },
        handleFunderChange: function(event) {
            const nameArr = event.target.name.split('-')
            const type = nameArr[0]
            const key = nameArr[1]
            const index = parseInt(nameArr[2])
            const value = key === "name" ? event.target.value : parseInt(Number(event.target.value.replace(/[^0-9\.-]+/g,"")))
            this[type][index][key] = value
        },
        handleSubmit: async function() {
            const uid = this.$route.params.uid
            const orgId = this.$route.params.id
            const orgRef = db.collection("users").doc(uid).collection("organizations").doc(orgId)
            const staffRef = orgRef.collection("staff")
            const institutional = orgRef.collection("institutional")
            const individual = orgRef.collection("individual")
            let batch = db.batch()

            batch.set(orgRef, this.organization)
            this.staff.forEach((member, index) => {
                let staffId = null
                if(member.id) {
                    staffId = member.id
                } else {
                    staffId = (+new Date()).toString() + "-" + index.toString()
                    member.id = staffId
                }
                const ref = staffRef.doc(staffId)
                if(member.name && member.role) {
                    batch.set(ref, member)
                }
                })
            this.institutional.forEach((funder, index) => {
                let InstId = null
                if(funder.id) {
                    InstId = funder.id
                } else {
                    InstId = (+new Date()).toString() + "-" + index.toString()
                    funder.id = InstId
                }
                const ref = institutional.doc(InstId)
                if (funder.name && funder.amount_donated) {
                    batch.set(ref, funder)
                }
            })
            this.individual.forEach((donor, index) => {
                let IndId = null
                if (donor.id) {
                    IndId = donor.id
                } else {
                    IndId = (+new Date()).toString() + "-" + index.toString()
                    donor.id = IndId
                }
                const ref = individual.doc(IndId)
                if (donor.name && donor.amount_donated) {
                    batch.set(ref, donor)
                }
            })
            return batch.commit()
                .then(() => {
                    console.log("added to firestore")
                    this.$router.go(-1)
                })    
        },
        handleUploadClick: function(event) {
            const ref = storage.ref()
            const name = (+new Date()) + '-' + this.file.name;
            const uid = auth.currentUser.uid
            const path = "images/" + uid + "/" + name
            this.organization.imagePath = path
            const metadata = {
            contentType: this.file.type
            };
            const task = ref.child(path).put(this.file, metadata);
            task
                .then(snapshot => snapshot.ref.getDownloadURL())
                .then((url) => {
                    this.organization.image = url
                    this.imageUploaded = true;
                    this.uploadedFilename = this.file.name;
                    console.log(this.organization.image);
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
    padding-top: 32px;
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

    .staff-controls, .funder-controls {
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

@media (min-width: 500px) {
    .org-form {
        width: 50%;
        position: relative;
        left: 25%;
    }
}

@media(min-width: 1000px ) {
    .org-form {
        width: 720px;
        left: calc(50% - (720px/2))
    }
}
</style>
