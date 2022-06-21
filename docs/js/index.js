import Vue from './vue.esm.browser.2.6.js'
// import gifsicle from './gifsicle.min.js'
import gifsicle from '../../src/index.js'
import gifsicleTool from './gifsicleTool.js'
import tool from './tool.js'
import {
    pxmu,
    pLoading,
    pClose,
    pOk,
    pErr,
    pNor
} from './pxmu.js'
var app = new Vue({
    el: '#app',
    data() {
        return {
            message: 'Hello Vue!',
            webUrl: '',
            isLoadedPage: false,
            isShare: false,
            isCopyShare: false,
            shareUrl: '',
            input: [
                // {
                //     name: '1.gif',
                //     isEditName: false,
                //     url: '1.gif',
                //     file: new Blob([]),
                //     width: 200,
                //     height: 300,
                //     frame: 122,
                //     size: '3.2Mb',
                //     time: '1.4s',
                //     loop: 0,
                //     id: 'mmjdjks'
                //      isWebUrl:false,
                // }
            ],
            command: [{
                value: `--colors=4 1.gif  -o /out/out.gif`,
            }],
            output: [
                // {
                //     name: '1.gif',
                //     isEditName: false,
                //     url: '../1.gif',
                //     file: new Blob([]),
                //     width: 200,
                //     height: 300,
                //     frame: 122,
                //     size: '3.2Mb',
                //     time: '1.4s',
                //     loop: 0,
                //     id: 'mmjdjks'
                // }
            ],
            outputInfo: {
                count: 0,
                time: '14.2s',
                isDone: false,
                isError: false,
                errorInfo: ''
            },
            randomUrl: [
                'https://media2.giphy.com/media/13CoXDiaCcCoyk/200.gif',
                'https://media3.giphy.com/media/yFQ0ywscgobJK/200.gif',
                'https://media2.giphy.com/media/Nm8ZPAGOwZUQM/200.gif',
                'https://media4.giphy.com/media/nR4L10XlJcSeQ/200.gif',
                'https://media3.giphy.com/media/ZE6HYckyroMWwSp11C/200.gif',
                'https://media.giphy.com/media/Ip3rI8W1YcXHO5MyHQ/giphy.gif',
                'https://media.giphy.com/media/I51igGCosZj90y3V9L/giphy.gif',
                'https://media.giphy.com/media/DNxgu3sg2Wcvw0mICK/giphy.gif',
                'https://media.giphy.com/media/jndc0TQq9fvK8/giphy.gif',
                'https://media.giphy.com/media/xvphP3Lp43WqMAjaC9/giphy.gif',
                'https://media.giphy.com/media/uUz0BGNhj6Kg4gRUaS/giphy.gif',
                'https://media.giphy.com/media/l4FGI8GoTL7N4DsyI/giphy.gif',
                'https://media.giphy.com/media/njON3jEmTYHEfRbfsk/200.gif',
                'https://media.giphy.com/media/1yC2geBmJJbhMWbyy6/giphy.gif',
                'https://media.giphy.com/media/FGg4dB6jZQYtW/giphy.gif',
                'https://media.giphy.com/media/l1J9qemh1La8b0Rag/giphy.gif',
                'https://media.giphy.com/media/9nuXRx5EfGsKc/giphy.gif',
                'https://media.giphy.com/media/hTh9bSbUPWMWk/giphy.gif',
                'https://media.giphy.com/media/NEvPzZ8bd1V4Y/giphy.gif',
                'https://media.giphy.com/media/mf8UbIDew7e8g/giphy.gif',
                'https://media.giphy.com/media/3o7aD5lNmqChBB5yE0/giphy.gif',
                'https://media.giphy.com/media/FbPsiH5HTH1Di/giphy.gif',
                'https://media.giphy.com/media/l3nSIMrTlKxFL9UGI/giphy.gif',
                'https://media.giphy.com/media/2F0IsIg0lHveE/giphy.gif',
            ],
        };
    },
    async created() {
    },
    computed: {},
    mounted() {
        setTimeout(() => {
            this.isLoadedPage = true
        }, 100);
        // this.addGif('./1.gif')
        // this.addGif('./2.gif')
        // this.addGif('./3.gif')
        // setTimeout(() => {
        //     this.run()
        // }, 3000);
        this.inputFilePageEvent()
        this.parseShare()
    },
    methods: {
        copyShare() {
            pxmu.copy(this.shareUrl);
            pOk('Copied')
            this.isCopyShare = false
            console.log(this.isCopyShare);
        },
        notCanCopyShare() {
            pNor('Must use url import GIFs to generate share')

        },
        creatShare() {
            this.isShare = this.input.every(e => e.isWebUrl)
            if (this.isShare) {
                let urls = this.input.map(m => {
                    return {
                        file: m.isWebUrl,
                        name: m.name
                    }
                })
                let data = {}
                data.input = urls
                data.command = this.command
                data = btoa(JSON.stringify(data))
                let site = location.origin + location.pathname

                this.shareUrl = `${site}?share=${data}`
                console.log(this.shareUrl);
            } else {
                this.shareUrl = ''
            }
        },
        parseShare() {
            let isCacheShare = localStorage.getItem('share')
            let url,search,param
            if (isCacheShare) {
                param = new URLSearchParams(isCacheShare);
                localStorage.removeItem('share')
            } else {
                url = location.href
                search = new URL(url).search
                param = new URLSearchParams(search);
                if (!param.has('share')) return
                let site = location.origin + location.pathname
                localStorage.setItem('share', search)
                location.href = site
                return
            }






            pOk('Parse Share...')
            pLoading()
            let share = param.get('share')
            share = atob(share)
            share = JSON.parse(share)
            console.log(share);
            this.input = []
            this.command = share.command
            let isOk = []
            for (let i = 0; i < share.input.length; i++) {
                const item = share.input[i];
                setTimeout(() => {
                    this.addGif(item.file, item.name).then(d => {
                        isOk.push(d)
                        if (isOk.length === share.input.length) {
                            if (isOk.every(e => Boolean(e))) {
                                this.run()
                            } else {
                                pClose()
                                pErr()
                            }
                        }
                    })
                }, i * 600);
            }


        },

        getRandomUrl() {
            let item = this.randomUrl[Math.floor(Math.random() * this.randomUrl.length)];
            this.addGif(item)
        },
        del(index, data) {
            data.splice(index, 1)
        },
        add(item, data) {
            data.push(item)
        },
        async addGif(url, name = '') {
            return new Promise(async (res, rej) => {
                pLoading()
                let blob = null
                let isWebUrl = false
                if (typeof url === 'string') {
                    blob = await fetch(url).then(d => d.blob())
                    isWebUrl = url
                } else {
                    blob = url
                }
                console.log(blob);
                gifsicleTool.getInfo(blob)
                    .then(info => {
                        console.log(info);
                        let {
                            height,
                            images,
                            loop,
                            palettet,
                            width,
                            frames,
                            size,
                            time,
                            file
                        } = info
                        pClose()
                        pOk()
                        this.input.push({
                            name: name || `${this.input.length + 1}.gif`,
                            isEditName: false,
                            url: URL.createObjectURL(file),
                            file: file,
                            width,
                            height,
                            frame: images,
                            size,
                            time,
                            loop,
                            palettet,
                            id: 'mmjdjks',
                            isWebUrl,
                        })
                        res(true)

                    }).catch(e => {
                        pClose()
                        pErr('Input Error:!' + e)
                        res(false)
                    })
            })

        },
        run() {
            if (!this.input.length) {
                pNor('none Gif!')
                return
            }
            if (!this.command.length) {
                pNor('none command!')
                return
            }

            pLoading()
            this.outputInfo.isDone = false
            this.output = []
            let input = this.input.map(m => {
                return {
                    file: m.file,
                    name: m.name
                }
            })
            let command = this.command.filter(f => Boolean(f.value))
            command = command.map(m => m.value)
            console.log(input, command);
            let time = new Date().getTime()
            gifsicle.run({
                input,
                command,
            }).then(outFiles => {
                let task = outFiles.map(file => {
                    return gifsicleTool.getInfo(file)
                })
                Promise.all(task).then(out => {
                    out.map((info, index) => {
                        console.log(info);
                        let {
                            height,
                            images,
                            loop,
                            palettet,
                            width,
                            frames,
                            size,
                            time
                        } = info
                        this.output.push({
                            name: `${outFiles[index].name}.gif`,
                            url: URL.createObjectURL(outFiles[index]),
                            file: outFiles[index],
                            width,
                            height,
                            frame: images,
                            size,
                            time,
                            loop,
                            palettet,
                            id: 'mmjdjks'
                        })
                    })
                    this.outputInfo.time = ((new Date().getTime() - time) / 1000).toFixed(1)
                    this.outputInfo.count = out.length
                    this.outputInfo.isDone = true
                    this.outputInfo.isError = false
                    pClose()
                    this.creatShare()

                }).catch(e => {
                    let err = 'Input Error:!' + e
                    this.outputInfo.isDone = false
                    this.outputInfo.isError = true
                    this.outputInfo.errorInfo = err
                    pClose()
                    pErr(err)
                })

            })
        },
        editName(index, name) {
            let item = this.inputxxx[index]
            item.name = name
        },
        /////////////////////////////
        isFileNoPageEl(e) {
            if (e.dataTransfer.types) {
                let type = e.dataTransfer.types[e.dataTransfer.types.length - 1];
                type = type ? type.toLowerCase() : null;
                // 正常拖入
                if (type === "files") {
                    return true
                }
                return false
            }
        },
        userFiles(filesList) {
            let files = Array.from(filesList)
            console.log(files);
            let okFiles = this.testFiles(files)
            for (let i = 0; i < okFiles.length; i++) {
                const item = okFiles[i];
                setTimeout(() => {
                    this.addGif(item)
                }, i * 600);
            }
        },
        testFiles(files) {
            return files.filter(f => {
                let name = f.name.toLowerCase()
                let isGif = name.includes('.gif')
                if (!isGif) pNor('Only supports GIFs')
                return isGif
            })
        },
        inputFilePageEvent() {
            let _this = this
            let body = document.querySelector('body')
            let input = document.querySelector('#file')
            ////////////////////
            body.addEventListener('drop', function (e) {
                e.preventDefault();
                // console.log('drop');
                let isFile = _this.isFileNoPageEl(e)
                if (!isFile) return
                body.style.border = "13px dashed transparent"
                _this.userFiles(e.dataTransfer.files)

            })
            body.addEventListener('dragover', function (e) {
                e.preventDefault();
                // console.log('dragover');
                let isFile = _this.isFileNoPageEl(e)
                if (!isFile) return
                body.style.border = "13px dashed var(--color)"

            })
            /////////////////////
            input.addEventListener('change', function (e) {
                _this.userFiles(this.files)
            });
        }

    },
    destroyed() { },
    watch: {
        input() {
            console.log(this.input);
        },
        command: {
            handler(val, oldVal) {
                console.log(this.input);
                console.log(this.command);
            },
            deep: true,
        },
    },
})
// 自动聚焦
Vue.directive('focus', {
    inserted: function (el) {
        el.focus()
    }
})
// 自动聚焦后全选
Vue.directive('focus-select', {
    inserted: function (el) {
        el.focus()
        el.select()
    }
})
// 手动选中时全选
Vue.directive('select', {
    inserted: function (el) {
        el.addEventListener('click', _ => {
            el.focus()
            el.select()
        })
    }
})