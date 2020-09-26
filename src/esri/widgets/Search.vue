<template>
    <div class="search-container" @mouseleave="searchShow=false">
        <el-input class="search-input" :placeholder="placeholder" v-model="keyword" @keyup.native.enter="submit" @focus="onFocus" clearable>
            <el-button class="search-button" slot="append" icon="el-icon-search" @click="submit"></el-button>
        </el-input>
        <ul class="search-ul" v-if="emptyShow">
            <li class="search-ul-e">
                <i class="el-icon-location-outline"></i>
                <span>未匹配任何数据</span>
            </li>
        </ul>
        <ul class="search-ul" v-if="searchShow">
            <li class="search-ul-e" v-for="(item,index) in results" :key="index" @click="select(item)">
                <i class="el-icon-location-outline"></i>
                <span>{{item.suggestion}}</span>
            </li>
        </ul>
    </div>
</template>
<script>
import { esri } from "esri";

export default {
    props: {
        placeholder: {
            type: String,
            default: "关键字"
        },
        queryFn: {
            type: Function,
            required: true
        }
    },
    data() {
        return {
            keyword: "",
            results: [],
            selectedFeature: null,
            searchShow: false,
            emptyShow: false
        };
    },
    watch: {
        keyword: function() {
            if (this.keyword.length == 0) {
                this.results = [];
                this.searchShow = false;
                this.emptyShow = false;
            }
        }
    },
    methods: {
        onFocus() {
            if (this.results && this.results.length) {
                this.searchShow = true;
            }
        },
        async submit() {
            var term = this.keyword.replace(/(^s*)|(s*$)/g, ""); //trim place

            this.results = [];

            if (term.length > 0) {
                this.results = await this.queryFn(term);

                this.results.forEach(f => {
                    f.suggestion = this.buildSuggest(f);
                });

                if (this.results.length == 0) {
                    this.emptyShow = true;
                    setTimeout(() => {
                        this.emptyShow = false;
                    }, 1000);
                } else {
                    this.searchShow = true;
                }
            }
        },
        select(item) {
            this.$emit("select", item);
            this.searchShow = false;
        },
        buildSuggest(feature) {
            let searchFields = feature.source.searchFields;
            let attr = feature.attributes;
            let result = "";

            searchFields.forEach(field => {
                result += attr[field] + ",";
            });
            result = result.substring(0, result.length - 1);
            return result;
        }
    }
};
</script>
<style lang="less" scoped>
.search-container {
    .search-button {
        background-color: #3284ff !important;
        text-align: center;
        color: #fff !important;
        border-radius: 0px;
    }
}

.search-ul {
    width: 90%;
    margin: 0 auto;
    margin-top: 10px;
    background-color: #fff;
    color: #4c4c4c;
    border-radius: 3px;
    box-shadow: 2px 2px 2px rgba(0, 0, 0, 0.15);
    max-height: 287px;
    overflow: auto;
}

.search-ul-e {
    width: 100%;
    height: 40px;
    border-bottom: 1px solid #e4e7ed;
    line-height: 40px;
    font-size: 15px;
    cursor: pointer;
}

.search-ul-e:hover {
    color: #fff;
    background-color: #409eff;
    border-color: #409eff;
}

.search-ul-e i,
.search-ul-e span {
    display: block;
    float: left;
}

.search-ul-e i {
    margin-top: 12px;
    margin-left: 10px;
}

.search-ul-e span {
    margin-left: 10px;
}
</style>