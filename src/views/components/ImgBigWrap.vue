 <template>
    <div>
        <div class="imgbig-wrap">
            <img class="imgbig-wrap" />
            <i class="el-icon-close" @click="ImgBigClose"></i>
        </div>
    </div>
</template>
<script>
export default {
    methods: {
        ImgBigClose() {
            $('.imgbig-wrap').hide();
            $('.imgbig-wrap').find('img').attr('src', '');
        }
    }
};
</script>
<style lang="less">
.imgbig-wrap {
    position: absolute;
    bottom: 0;
    left: 0;
    top: 0;
    right: 0;
    pointer-events: auto;
    background-color: rgba(0, 0, 0, 0.6);
    z-index: 999991;
    display: none;
}

.imgbig-wrap img {
    width: auto;
    height: 90%;
    max-width: 90%;
    position: absolute;
    top: 50%;
    left: 50%;
    transform: translate(-50%, -50%);
}

.imgbig-wrap i {
    position: absolute;
    right: 36px;
    top: 24px;
    font-size: 60px;
    color: #fff;
}
</style>

