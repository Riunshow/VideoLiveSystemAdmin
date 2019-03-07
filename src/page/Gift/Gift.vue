<template>
	<div class="giftManage" v-loading="loading">
		<div class="defaultGift">
			<div class="info">
				<span>默认礼物配置</span>
				<el-button type="primary" size="mini" plain round @click="defaultGiftDialog = true">添加默认礼物</el-button>
			</div>
			<div class="gift">
				<gift-comp
					v-if="defaultGiftList.length !== 0"
					v-for="(item, index) in defaultGiftList"
					:defaultGiftList="item" 
					:key="index"
					v-on:deleteGift="deleteGift"
				/>
				<div v-else>
					无默认礼物
				</div>
			</div>
		</div>

		<!-- default dialog -->
		<el-dialog title="礼物信息" :visible.sync="defaultGiftDialog">
			<el-form :model="defaultGiftForm">
				<el-form-item label="礼物图片" :label-width="formLabelWidth">
					<upload 
						v-on:getImgUrl="getImgUrl"
					/>
				</el-form-item>
				<el-form-item label="礼物名称" :label-width="formLabelWidth">
					<el-input v-model="defaultGiftForm.giftName" auto-complete="off"></el-input>
				</el-form-item>
				<el-form-item label="礼物所需积分" :label-width="formLabelWidth">
					<el-input v-model="defaultGiftForm.giftPrice" auto-complete="off"></el-input>
				</el-form-item>
			</el-form>
			<div slot="footer" class="dialog-footer">
				<el-button @click="defaultGiftDialog = false">取 消</el-button>
				<el-button v-if="canClickDefault" type="primary" @click="addDefaultGift">确 定</el-button>
				<el-button v-else disabled>确 定</el-button>
			</div>
		</el-dialog>

		<div class="personalGift">
			<div class="info">
				<span>主播定制礼物</span>
				<el-button type="primary" size="mini" plain round @click="personalGiftDialog = true">添加定制礼物</el-button>
			</div>
			<div class="personInfo" v-for="(item, index) in personalGiftList" :key="index">
				<span>主播: {{item.giftGroupName}}, 主播id: {{item.user_id}}</span>
				<div class="gift">
					<gift-comp 
						v-for="(giftItem, giftIndex) in item.gifts" 
						:key="giftIndex"
						:defaultGiftList="giftItem" 
						v-on:deleteGift="deleteGift"
					/>
				</div>
			</div>
		</div>

		<!-- personal dialog -->
		<el-dialog title="礼物信息" :visible.sync="personalGiftDialog">
			<el-form :model="personalGiftForm">
				<el-form-item label="礼物图片" :label-width="formLabelWidth">
					<upload 
						v-on:getImgUrl="getImgUrl"
						:imgUrl="imgUrl"
					/>
				</el-form-item>
				<el-form-item label="用户id" :label-width="formLabelWidth">
					<el-input v-model="personalGiftForm.user_id" auto-complete="off"></el-input>
				</el-form-item>
				<el-form-item label="礼物名称" :label-width="formLabelWidth">
					<el-input v-model="personalGiftForm.giftName" auto-complete="off"></el-input>
				</el-form-item>
				<el-form-item label="礼物所需积分" :label-width="formLabelWidth">
					<el-input v-model="personalGiftForm.giftPrice" auto-complete="off"></el-input>
				</el-form-item>
			</el-form>
			<div slot="footer" class="dialog-footer">
				<el-button @click="personalGiftDialog = false">取 消</el-button>
				<el-button v-if="canClickPersonal" type="primary" @click="addPersonalGift">确 定</el-button>
				<el-button v-else disabled>确 定</el-button>
			</div>
		</el-dialog>

	</div>
</template>

<script>
import GiftComp from './GiftComponents'
import Upload from './../../components/Upload'

export default {
	components: {
		GiftComp,
		Upload
	},
	data () {
		return {
			loading: false,
			formLabelWidth: '100px',
			imgUrl: '',
			// 默认礼物
			canClickDefault: false,
			defaultGiftDialog: false,
			defaultGiftForm: {
				giftAvatar: '',
				giftName: '',
				giftPrice: ''
			},
			defaultGiftList: [],
			// 主播定制礼物
			canClickPersonal: false,
			personalGiftDialog: false,
			personalGiftForm: {
				user_id: '',
				giftAvatar: '',
				giftName: '',
				giftPrice: ''
			},
			personalGiftList: [],
		};
	},
	async created () {
		await this.fetchData()
	},
	methods: {
		// 请求数据
		async fetchData() {
			this.loading = true
			await this.getDefaultGiftList()
			await this.getPersonalGiftList()
			this.loading = false
		},
		// 获取选择的图片
		getImgUrl(url) {
			this.imgUrl = url

			this.defaultGiftDialog ? this.defaultGiftForm.giftAvatar = this.imgUrl : this.personalGiftForm.giftAvatar = this.imgUrl
			this.defaultGiftDialog ? this.canClickDefault = true : this.canClickPersonal = true
		},
		// 获取默认礼物列表
		async getDefaultGiftList() {
			const result = await this.$request('/api/gift/getDefaultGiftList')
			this.defaultGiftList = result.data
		},
		// 获取定制礼物列表
		async getPersonalGiftList() {
			const result = await this.$request('/api/gift/getPersonalGift')
			this.personalGiftList = result.data
		},
		// 添加默认礼物
		async addDefaultGift() {
			const result = await this.$request('/api/gift/addDefaultGift', 'POST', {
				giftName: this.defaultGiftForm.giftName,
				giftAvatar: this.defaultGiftForm.giftAvatar,
				price: this.defaultGiftForm.giftPrice,
			})
			if (result.success) {
				this.$messge.success('添加成功')
				this.imgUrl = ''
				this.canClickDefault = false
				this.defaultGiftDialog = false
				this.defaultGiftForm = {
					giftAvatar: '',
					giftName: '',
					giftPrice: ''
				}
				await this.fetchData()
			}
		},
		// 添加定制礼物
		async addPersonalGift() {
			const result = await this.$request('/api/gift/addPersonalGift', 'POST', {
				user_id: this.personalGiftForm.user_id,
				giftName: this.personalGiftForm.giftName,
				giftAvatar: this.personalGiftForm.giftAvatar,
				price: this.personalGiftForm.giftPrice,
			})
			if (result.success) {
				this.$messge.success('添加成功')
				this.imgUrl = ''
				this.personalGiftDialog = false
				this.canClickPersonal = false
				this.personalGiftForm = {
					giftAvatar: '',
					giftName: '',
					giftPrice: '',
					user_id: ''
				}
				await this.fetchData()
			}
		},

		// 删除礼物
		async deleteGift(giftId) {
			const result = await this.$request('/api/gift/deleteGift', 'DELETE', {
				giftId
			})
			if (result.success) {
				this.$message.success('删除成功')
				await this.fetchData()
			}
		}
	}
}
</script>

<style lang="scss" scoped>
.giftManage {
	.defaultGift, .personalGift{
		margin-bottom: 15px;
		// height: 200px;
		border: 1px solid #e5e5e5;
		border-radius: 10px;
		padding: 10px;

		.info {
			margin-bottom: 10px;

			span {
				margin-right: 10px;
			}
		}

		.gift {
			display: flex;
			flex-wrap: wrap;
		}
	}

	.personalGift {
		.personInfo {
			margin-bottom: 10px;
		}
	}

}
</style>