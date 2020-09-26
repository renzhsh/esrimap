<template>
    <FlexView class="split-screen-cross">
        <div class="cross-wrapper">
            <div class="content">
                <div>
                    <div class="item right-border bottom-border"></div>
                    <div class="item left-border bottom-border"></div>
                </div>
                <div>
                    <div class="item right-border top-border"></div>
                    <div class="item left-border top-border"></div>
                </div>
            </div>
        </div>
    </FlexView>
</template>
<script>
export default {};
</script>
<style lang="less" scoped>
.split-screen-cross {
    .cross-wrapper {
        height: 100%;
        justify-content: center;
        align-items: center;
        display: flex;
    }
    .content {
        height: 64px;
        width: 64px;

        .item {
            height: 30px;
            width: 30px;
            float: left;
        }

        .top-border {
            border-top: 0.5px solid red;
        }

        .left-border {
            border-left: 0.5px solid red;
        }

        .bottom-border {
            border-bottom: 0.5px solid red;
        }

        .right-border {
            border-right: 0.5px solid red;
        }
    }
}
</style>


