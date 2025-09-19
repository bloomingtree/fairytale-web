<template>
    <div class="w-full flex flex-col bg-slate-50 py-2 px-1 rounded-md">
        <audio ref="audio" preload="auto" />
        <div class="w-full h-2 cursor-pointer" @click="seekToTime">
            <div :style="'width: '+playTime/totalTime*100+'%;'" class="bg-red-300"></div>
        </div>
        <div class="w-full h-2 relative flex justify-center items-center">
            <div>
                {{Math.floor(playTime/60).toString().padStart(2, '0')}}:{{Math.floor(playTime%60).toString().padStart(2, '0')}}
            </div>
            <div class="h-full flex-1 relative mx-2">
                <div class="w-full h-full absolute top-0 bg-gray-200 bottom-0 left-0 rounded-full"></div>
                <div class="w-1 h-full absolute top-0 bg-slate-400 z-10 rounded-full" :style="'width: '+playTime/totalTime*100+'%;'"></div>
            </div>
            <div>
                {{Math.floor(totalTime/60).toString().padStart(2, '0')}}:{{Math.floor(totalTime%60).toString().padStart(2, '0')}}
            </div>
        </div>
         <!-- 控制按钮 -->
        <div class="flex gap-2 z-20 justify-center mt-2">
        <button 
            @click="togglePlay"
            class="p-0 rounded-full hover:drop-shadow-xl transition-colors flex items-center justify-center w-14 h-14">
            <svg v-if="!isPlaying" class="w-14 h-14" t="1758238127915" viewBox="0 0 1024 1024" version="1.1" xmlns="http://www.w3.org/2000/svg" p-id="6481" width="200" height="200"><path d="M826.709333 529.749333L374.485333 831.232A21.333333 21.333333 0 0 1 341.333333 813.482667V210.517333a21.333333 21.333333 0 0 1 33.152-17.749333l452.224 301.482667a21.333333 21.333333 0 0 1 0 35.498666z" p-id="6482"></path></svg>
            <svg v-else class="w-12 h-12" t="1758238259467" viewBox="0 0 1024 1024" version="1.1" xmlns="http://www.w3.org/2000/svg" p-id="7642" width="200" height="200"><path d="M428.539658 833.494155c0 15.954367-13.053294 29.007661-29.007661 29.007661L285.613458 862.501816c-15.954367 0-29.007661-13.053294-29.007661-29.007661l0-639.423111c0-15.954367 13.053294-29.007661 29.007661-29.007661l113.918539 0c15.954367 0 29.007661 13.053294 29.007661 29.007661L428.539658 833.494155z" fill="#3D3B4F" p-id="7643"></path><path d="M760.124635 833.494155c0 15.954367-13.053294 29.007661-29.007661 29.007661l-113.918539 0c-15.954367 0-29.007661-13.053294-29.007661-29.007661l0-639.423111c0-15.954367 13.053294-29.007661 29.007661-29.007661l113.918539 0c15.954367 0 29.007661 13.053294 29.007661 29.007661L760.124635 833.494155z" fill="#3D3B4F" p-id="7644"></path></svg>
        </button>
        </div>
    </div>
</template>
<script>
export default {
    name: 'AudioPlayer',
    props: {
        src: {
            type: String,
            required: true,
        },
        index: {
            type: Number,
            required: true
        }
    },
    data() {
        return {
            playTime: 0,
            totalTime: 0,
            isPlaying: false, // 播放状态
        }
    },
    methods: {
        handleKeyboard(event) {
            if(this.$refs.audio.readyState <= 2) {
                return
            }
            
            if (event.keyCode === 32) {
                // 空格
                event.preventDefault()
                if (this.$refs.audio.paused) {
                    // 如果音频暂停，则播放音频
                    this.start()
                } else {
                    // 如果音频正在播放，则暂停音频
                    this.pause()
                }
            } else {
                const isPaused = this.$refs.audio.paused
                // 检查是否按下了左箭头键（keyCode 37）或右箭头键（keyCode 39）
                if (event.key === ',') {
                    // 向前移动3秒
                    if(!isPaused) {
                        this.$refs.audio.pause()
                    }
                    this.$refs.audio.currentTime -= 3;
                    this.timeUpdate(true)
                } else if (event.key === '.') {
                    // 向后移动3秒
                    if(!isPaused) {
                        this.$refs.audio.pause()
                    }
                    this.$refs.audio.currentTime += 3
                    this.timeUpdate(true)
                }else if (event.key === 'b') {
                    // 回到最开始
                    if(!isPaused) {
                        this.$refs.audio.pause()
                    }
                    this.$refs.audio.pause()
                    this.$refs.audio.currentTime = 0
                    this.timeUpdate(true)
                }
                if(!isPaused) {
                    this.$refs.audio.play()
                }
            }
        },
        setSrc(srcUrl) {
            this.$refs.audio.src = srcUrl
            this.$refs.audio.removeEventListener('loadedmetadata', this.handleLoadedMetadata)
            this.$refs.audio.addEventListener('loadedmetadata', this.handleLoadedMetadata)
        },
        handleLoadedMetadata() {
            const duration = this.$refs.audio.duration
            this.totalTime = duration
            this.$refs.audio.removeEventListener('loadedmetadata', this.handleLoadedMetadata)
        },
        timeUpdate(isManual) {
            this.playTime = this.$refs.audio.currentTime
            this.$emit('timeupdate', this.$refs.audio.currentTime, isManual === true)   // 默认传值为数字(当前播放时间)，如果是手动的就会传值true，所以要判断一下
            
            // 同步播放状态
            this.isPlaying = !this.$refs.audio.paused
            
            if(!this.$refs.audio.paused) {
                window.requestAnimationFrame(this.timeUpdate)
            }
        },
        start() {
            this.$refs.audio.play()
            this.isPlaying = true
            this.timeUpdate(true)
        },
        pause() {
            if (!this.$refs.audio.paused) {
                this.$refs.audio.pause()
                this.isPlaying = false
            }
        },
        togglePlay() {
            if (this.$refs.audio.readyState <= 2) {
                return
            }
            
            if (this.$refs.audio.paused) {
                // 如果音频暂停，则播放音频
                this.start()
            } else {
                // 如果音频正在播放，则暂停音频
                this.pause()
            }
        },
        seekToTime(event) {
            if (this.$refs.audio.readyState <= 2) {
                return
            }
            
            const rect = event.currentTarget.getBoundingClientRect()
            const clickX = event.clientX - rect.left
            const percentage = clickX / rect.width
            const newTime = percentage * this.totalTime
            
            // 设置音频时间
            this.$refs.audio.currentTime = newTime
            this.timeUpdate(true)
        },
        getIsPlaying() {
            return this.isPlaying || Math.abs(this.playTime - this.totalTime) < 0.5
        },
        getPlayTime() {
            return this.playTime
        }
    },
    mounted() {
        if(this.src) {
            this.setSrc(this.src)
        }
        window.addEventListener('keydown', this.handleKeyboard)
        
        // 监听音频播放结束事件
        this.$refs.audio.addEventListener('ended', () => {
            this.isPlaying = false
            this.$emit('play-ended', this.index)
        })
    },
    beforeUnmount() {
        // 组件销毁前移除事件监听
        window.removeEventListener('keydown', this.handleKeyboard)
    },
    
}
</script>