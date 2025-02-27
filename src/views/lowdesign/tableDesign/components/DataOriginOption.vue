<template>
  <div class="data-origin-option table-design-option">
    <el-tabs v-model="typeTabsVal" tab-position="left" type="border-card" class="h-100%">
      <el-tab-pane name="option">
        <template #label>
          <el-radio v-model="typeTabsVal" label="option">拖拽配置</el-radio>
        </template>
        <el-container class="w-100% h-100%">
          <el-main class="p-0!">
            <avue-tabs
              ref="tabsRef"
              :option="tabsOption"
              @change="(column) => (tabsValue = column)"
            ></avue-tabs>
            <div class="origin-content select-content" v-show="tabsValue.prop == 'select'">
              <el-container class="h-100%">
                <el-aside width="260px" class="left-tree">
                  <el-tabs v-model="selectTabValue" class="select-tab-content">
                    <el-tab-pane label="表字段选择" name="select" class="pl-10px pr-10px">
                      <draggable
                        class="summary-content mb-10px"
                        tag="div"
                        :list="customList"
                        :group="{ name: 'config', pull: 'clone', put: false }"
                        ghost-class="summary-ghost"
                        :sort="false"
                        item-key="value"
                      >
                        <template #item="{ element }">
                          <div class="summary-item w-220px!" @click="clickAddColumn(element)">
                            <span>{{ element.label }}</span>
                          </div>
                        </template>
                      </draggable>
                      <template v-for="item in tableList" :key="item.value">
                        <div
                          class="summary-title flex items-center gap-x-10px"
                          @click="
                            collapseValue == item.value
                              ? (collapseValue = '')
                              : (collapseValue = item.value)
                          "
                        >
                          <div class="flex-1">
                            <div>
                              <span>{{ item.tableName }}</span>
                              <span class="text-12px">（{{ item.tableText }}）</span>
                            </div>
                          </div>
                          <Icon
                            v-if="collapseValue == item.value"
                            :size="14"
                            icon="ep:arrow-down"
                          ></Icon>
                          <Icon
                            v-show="collapseValue != item.value"
                            :size="14"
                            icon="ep:arrow-right"
                          ></Icon>
                        </div>
                        <el-collapse-transition>
                          <div v-show="collapseValue == item.value" class="summary-draggable">
                            <draggable
                              class="summary-content pb-20px"
                              tag="div"
                              :list="item.fieldList"
                              :group="{ name: 'config', pull: 'clone', put: false }"
                              ghost-class="summary-ghost"
                              :sort="false"
                              item-key="value"
                            >
                              <template #item="{ element }">
                                <div class="summary-item" @click="clickAddColumn(element)">
                                  <span>{{ element.label }}</span>
                                </div>
                              </template>
                            </draggable>
                          </div>
                        </el-collapse-transition>
                      </template>
                    </el-tab-pane>
                    <el-tab-pane label="表别名配置" name="alias">
                      <div
                        class="alias-item w-100% pl-10px pr-10px pb-10px mb-10px box-border"
                        v-for="item in tableList"
                        :key="item.value"
                      >
                        <div>
                          <span>{{ item.tableName }}</span>
                          <span class="text-12px">（{{ item.tableText }}）</span>
                        </div>
                        <div class="flex items-center mt-4px">
                          <span class="flex-basis-38px flex-shrink-0 text-12px">别名：</span>
                          <avue-input
                            size="small"
                            v-model="aliasObj[item.tableName]"
                            :clearable="false"
                          ></avue-input>
                        </div>
                      </div>
                    </el-tab-pane>
                  </el-tabs>
                </el-aside>
                <el-main class="main-option">
                  <div class="c-#409EFF text-16px pl-20px pt-10px pb-10px">
                    <span>SELECT</span>
                    <el-popconfirm title="确认清空？" @confirm="handleEmpty('select')">
                      <template #reference>
                        <el-button class="ml-10px" size="small" type="danger">清空</el-button>
                      </template>
                    </el-popconfirm>
                  </div>
                  <div class="option-content" :class="{ full: !optionObj.select?.length }">
                    <draggable
                      :class="`content-draggable`"
                      :list="optionObj.select"
                      :group="{ name: 'option', put: true }"
                      ghost-class="option-ghost"
                      :animation="300"
                      handle=".move-icon"
                      item-key="prop"
                      @add="(e) => handleAddColumn(e)"
                    >
                      <template #item="{ element }">
                        <div class="summary-control">
                          <template v-if="element.controlType == 'text'">
                            <div class="border-box flex items-center gap-x-4px">
                              <span>
                                {{ aliasObj[element.tableName] || element.tableName }}.{{
                                  element.value
                                }}
                              </span>
                              <span v-show="element.alias">AS</span>
                              <avue-input
                                v-model="element.alias"
                                :clearable="false"
                                placeholder="别名"
                                class="w-50px flex-basis-50px flex-shrink-0"
                              ></avue-input>
                            </div>
                          </template>
                          <template v-else-if="element.controlType == 'custom'">
                            <div class="border-box">
                              <el-popover
                                placement="bottom-start"
                                :popperStyle="{ width: 'auto', height: 'auto' }"
                                trigger="click"
                              >
                                <template #reference>
                                  <div
                                    v-if="element.value"
                                    class="text-14px pr-10px cursor-pointer"
                                  >
                                    {{ element.value }}
                                  </div>
                                  <div v-else class="text-12px c-#999"> 点击输入自定义SQL</div>
                                </template>
                                <div class="w-40vw h-200px">
                                  <MonacoEditor
                                    v-model="element.value"
                                    language="mysql"
                                    :editorOption="{ minimap: false }"
                                  />
                                </div>
                              </el-popover>
                            </div>
                          </template>
                          <div class="del-icon" @click="delRow(element, 'select')">
                            <Icon
                              color="#F56C6C"
                              :size="22"
                              icon="lets-icons:dell-fill"
                              class="mr-3px"
                            />
                          </div>
                          <div class="move-icon">
                            <Icon :size="22" icon="mingcute:move-line" class="mr-3px" />
                          </div>
                        </div>
                      </template>
                    </draggable>
                  </div>
                </el-main>
              </el-container>
            </div>
            <div class="origin-content from-content" v-show="tabsValue.prop == 'from'">
              <el-container class="h-100%">
                <el-aside width="220px" class="left-tree">
                  <draggable
                    class="summary-content mb-10px"
                    tag="div"
                    :list="customList"
                    :group="{ name: 'config', pull: 'clone', put: false }"
                    ghost-class="summary-ghost"
                    :sort="false"
                    item-key="value"
                  >
                    <template #item="{ element }">
                      <div class="summary-item w-180px!" @click="clickAddColumn(element)">
                        <span>{{ element.label }}</span>
                      </div>
                    </template>
                  </draggable>
                  <template v-for="item in tableList" :key="item.value">
                    <div
                      class="flex items-center gap-x-10px"
                      @click="
                        collapseValue == item.value
                          ? (collapseValue = '')
                          : (collapseValue = item.value)
                      "
                    >
                      <draggable
                        class="summary-content mb-10px"
                        tag="div"
                        :list="[item]"
                        :group="{ name: 'config', pull: 'clone', put: false }"
                        ghost-class="summary-ghost"
                        :sort="false"
                        item-key="value"
                      >
                        <template #item="{ element }">
                          <div class="relative w-100%">
                            <div class="summary-item mb-0! pr-18px! w-170px!">
                              <span>{{ element.label }}</span>
                            </div>
                            <div class="absolute right-4px top-50% mt--8px">
                              <Icon
                                v-if="collapseValue == item.value"
                                :size="14"
                                icon="ep:arrow-down"
                              ></Icon>
                              <Icon
                                v-show="collapseValue != item.value"
                                :size="14"
                                icon="ep:arrow-right"
                              ></Icon>
                            </div>
                          </div>
                        </template>
                      </draggable>
                    </div>
                    <el-collapse-transition>
                      <div v-show="collapseValue == item.value" class="summary-draggable">
                        <draggable
                          class="summary-content pb-20px"
                          tag="div"
                          :list="item.fieldList"
                          :group="{ name: 'config', pull: 'clone', put: false }"
                          ghost-class="summary-ghost"
                          :sort="false"
                          item-key="value"
                        >
                          <template #item="{ element }">
                            <div class="summary-item" @click="clickAddColumn(element)">
                              <span>{{ element.label }}</span>
                            </div>
                          </template>
                        </draggable>
                      </div>
                    </el-collapse-transition>
                  </template>
                </el-aside>
                <el-main class="main-option">
                  <div class="c-#409EFF text-16px pl-20px pt-10px pb-10px">
                    <span>FROM</span>
                    <el-popconfirm title="确认清空？" @confirm="handleEmpty('from')">
                      <template #reference>
                        <el-button class="ml-10px" size="small" type="danger">清空</el-button>
                      </template>
                    </el-popconfirm>
                  </div>
                  <div class="option-content" :class="{ full: !optionObj.from?.length }">
                    <draggable
                      :class="`content-draggable`"
                      :list="optionObj.from"
                      :group="{ name: 'option', put: true }"
                      ghost-class="option-ghost"
                      :animation="300"
                      handle=".move-icon"
                      item-key="prop"
                      @add="(e) => handleAddColumn(e)"
                    >
                      <template #item="{ element, index }">
                        <div class="summary-control">
                          <template v-if="element.controlType == 'text'">
                            <div class="border-box" v-if="element.type == 'table'">
                              <avue-select
                                v-if="index != 0"
                                :class="['select_' + element.prop + '_from']"
                                class="condition-select w-105px"
                                :style="{ width: element.width_from || '130px' }"
                                v-model="element.connectType"
                                :dic="connectTypeDic"
                                placeholder="连接方式"
                                :clearable="false"
                                @change="() => setSelectWidth(optionObj.from[index], 0, '_from')"
                              ></avue-select>
                              <span>
                                {{ element.tableName }} AS
                                {{ aliasObj[element.tableName] || element.tableName }}
                              </span>
                              <span class="ml-5px" v-if="index != 0">ON</span>
                            </div>
                            <div v-else-if="element.type == 'field'" class="flex items-center">
                              <div class="border-box">
                                {{ aliasObj[element.tableName] || element.tableName }}.{{
                                  element.value
                                }}
                              </div>
                              <span class="ml-8px">{{ getFromFieldChars(index) }}</span>
                            </div>
                          </template>
                          <template v-else-if="element.controlType == 'custom'">
                            <div class="border-box">
                              <el-popover
                                placement="bottom-start"
                                :popperStyle="{ width: 'auto', height: 'auto' }"
                                trigger="click"
                              >
                                <template #reference>
                                  <div
                                    v-if="element.value"
                                    class="text-14px pr-10px cursor-pointer"
                                  >
                                    {{ element.value }}
                                  </div>
                                  <div v-else class="text-12px c-#999"> 点击输入自定义SQL</div>
                                </template>
                                <div class="w-40vw h-200px">
                                  <MonacoEditor
                                    v-model="element.value"
                                    language="mysql"
                                    :editorOption="{ minimap: false }"
                                  />
                                </div>
                              </el-popover>
                            </div>
                          </template>
                          <div class="del-icon" @click="delRow(element, 'from')">
                            <Icon
                              color="#F56C6C"
                              :size="22"
                              icon="lets-icons:dell-fill"
                              class="mr-3px"
                            />
                          </div>
                          <div class="move-icon">
                            <Icon :size="22" icon="mingcute:move-line" class="mr-3px" />
                          </div>
                        </div>
                      </template>
                    </draggable>
                  </div>
                </el-main>
              </el-container>
            </div>
            <div class="origin-content where-content" v-show="tabsValue.prop == 'where'">
              <el-container class="h-100%">
                <el-aside width="220px" class="left-tree">
                  <draggable
                    class="summary-content mb-10px"
                    tag="div"
                    :list="customList"
                    :group="{ name: 'config', pull: 'clone', put: false }"
                    ghost-class="summary-ghost"
                    :sort="false"
                    item-key="value"
                  >
                    <template #item="{ element }">
                      <div class="summary-item w-180px!" @click="clickAddColumn(element)">
                        <span>{{ element.label }}</span>
                      </div>
                    </template>
                  </draggable>
                  <div>
                    <div
                      class="summary-title flex items-center gap-x-10px"
                      @click="
                        collapseValue == 'particular'
                          ? (collapseValue = '')
                          : (collapseValue = 'particular')
                      "
                    >
                      <div class="flex-1">
                        <div> 特定占位符 </div>
                      </div>
                      <Icon
                        v-if="collapseValue == 'particular'"
                        :size="14"
                        icon="ep:arrow-down"
                      ></Icon>
                      <Icon
                        v-show="collapseValue != 'particular'"
                        :size="14"
                        icon="ep:arrow-right"
                      ></Icon>
                    </div>
                    <el-collapse-transition>
                      <div v-show="collapseValue == 'particular'" class="summary-draggable mb-10px">
                        <div
                          class="summary-item cursor-pointer! hover:b-#fff!"
                          v-for="item in particularDic"
                          :key="item.value"
                          @click="copyText(item.value)"
                        >
                          <span>{{ item.label }}</span>
                        </div>
                      </div>
                    </el-collapse-transition>
                  </div>
                  <template v-for="item in tableList" :key="item.value">
                    <div
                      class="summary-title flex items-center gap-x-10px"
                      @click="
                        collapseValue == item.value
                          ? (collapseValue = '')
                          : (collapseValue = item.value)
                      "
                    >
                      <div class="flex-1">
                        <div>
                          <span>{{ item.tableName }}</span>
                          <span class="text-12px">（{{ item.tableText }}）</span>
                        </div>
                      </div>
                      <Icon
                        v-if="collapseValue == item.value"
                        :size="14"
                        icon="ep:arrow-down"
                      ></Icon>
                      <Icon
                        v-show="collapseValue != item.value"
                        :size="14"
                        icon="ep:arrow-right"
                      ></Icon>
                    </div>
                    <el-collapse-transition>
                      <div v-show="collapseValue == item.value" class="summary-draggable">
                        <draggable
                          class="summary-content pb-20px"
                          tag="div"
                          :list="item.fieldList"
                          :group="{ name: 'config', pull: 'clone', put: false }"
                          ghost-class="summary-ghost"
                          :sort="false"
                          item-key="value"
                        >
                          <template #item="{ element }">
                            <div class="summary-item" @click="clickAddColumn(element)">
                              <span>{{ element.label }}</span>
                            </div>
                          </template>
                        </draggable>
                      </div>
                    </el-collapse-transition>
                  </template>
                </el-aside>
                <el-main class="main-option">
                  <div class="c-#409EFF text-16px pl-20px pt-10px pb-10px">
                    <span>WHERE</span>
                    <el-popconfirm title="确认清空？" @confirm="handleEmpty('where')">
                      <template #reference>
                        <el-button class="ml-10px" size="small" type="danger">清空</el-button>
                      </template>
                    </el-popconfirm>
                  </div>
                  <div class="option-content" :class="{ full: !optionObj.where?.length }">
                    <draggable
                      :class="`content-draggable`"
                      :list="optionObj.where"
                      :group="{ name: 'option', put: true }"
                      ghost-class="option-ghost"
                      :animation="300"
                      handle=".move-icon"
                      item-key="prop"
                      @add="(e) => handleAddColumn(e)"
                    >
                      <template #item="{ element, index }">
                        <div class="summary-control border-box flex">
                          <template v-if="element.controlType == 'custom'">
                            <el-popover
                              placement="bottom-start"
                              :popperStyle="{ width: 'auto', height: 'auto' }"
                              trigger="click"
                            >
                              <template #reference>
                                <div v-if="element.value" class="text-14px pr-10px cursor-pointer">
                                  {{ element.value }}
                                </div>
                                <div v-else class="text-12px c-#999"> 点击输入自定义SQL</div>
                              </template>
                              <div class="w-40vw h-200px">
                                <MonacoEditor
                                  v-model="element.value"
                                  language="mysql"
                                  :editorOption="{ minimap: false }"
                                />
                              </div>
                            </el-popover>
                          </template>
                          <template v-else>
                            <div>
                              {{ aliasObj[element.tableName] || element.tableName }}.{{
                                element.value
                              }}
                            </div>
                            <avue-select
                              :class="['select_' + element.prop + '_where']"
                              class="condition-select"
                              :style="{ width: element.width_where || '130px' }"
                              v-model="element.condition"
                              :dic="conditionDic"
                              placeholder="选择条件类型"
                              :clearable="false"
                              @change="(data) => whereTypeChange(data, index)"
                            ></avue-select>
                            <template v-if="element.controlType == 'default'">
                              <avue-input
                                class="flex-1 w-100px"
                                v-model="element.conditionValue"
                                placeholder="值"
                              ></avue-input>
                            </template>
                            <template v-else-if="element.controlType == 'between'">
                              <avue-input
                                class="flex-1 w-100px"
                                v-model="element.conditionValue[0]"
                                placeholder="值"
                              ></avue-input>
                              <div>AND</div>
                              <avue-input
                                class="flex-1 w-100px"
                                v-model="element.conditionValue[1]"
                                placeholder="值"
                              ></avue-input>
                            </template>
                            <template v-else-if="element.controlType == 'in'">
                              <div>(</div>
                              <avue-select
                                v-model="element.conditionValue"
                                multiple
                                filterable
                                allowCreate
                                :collapseTags="true"
                                :collapseTagsTooltip="true"
                                :maxCollapseTags="2"
                                :dic="[{ label: '请直接输入值', value: 'tip', disabled: true }]"
                              ></avue-select>
                              <div>)</div>
                            </template>
                          </template>
                          <div class="del-icon" @click="delRow(element, 'where')">
                            <Icon
                              color="#F56C6C"
                              :size="22"
                              icon="lets-icons:dell-fill"
                              class="mr-3px"
                            />
                          </div>
                          <div class="move-icon">
                            <Icon :size="22" icon="mingcute:move-line" class="mr-3px" />
                          </div>
                        </div>
                      </template>
                    </draggable>
                  </div>
                </el-main>
              </el-container>
            </div>
            <div class="origin-content groupby-content" v-show="tabsValue.prop == 'groupBy'">
              <el-container class="h-100%">
                <el-main class="main-option">
                  <div class="c-#409EFF text-16px pl-20px pt-10px pb-10px relative">
                    <span>GROUP BY</span>
                    <el-button
                      class="ml-20px absolute left-110px top-9px"
                      type="info"
                      size="small"
                      @click="setGroupByText"
                    >
                      生成GROUP BY内容
                    </el-button>
                  </div>
                  <div class="option-content">
                    <MonacoEditor v-model="optionObj.groupBy" language="mysql"></MonacoEditor>
                  </div>
                </el-main>
              </el-container>
            </div>
            <div class="origin-content having-content" v-show="tabsValue.prop == 'having'">
              <el-container class="h-100%">
                <el-main class="main-option">
                  <div class="c-#409EFF text-16px pl-20px pt-10px pb-10px">HAVING</div>
                  <div class="option-content">
                    <MonacoEditor v-model="optionObj.having" language="mysql"></MonacoEditor>
                  </div>
                </el-main>
              </el-container>
            </div>
            <div class="origin-content orderby-content" v-show="tabsValue.prop == 'orderBy'">
              <el-container class="h-100%">
                <el-aside width="220px" class="left-tree">
                  <draggable
                    class="summary-content mb-10px"
                    tag="div"
                    :list="customList"
                    :group="{ name: 'config', pull: 'clone', put: false }"
                    ghost-class="summary-ghost"
                    :sort="false"
                    item-key="value"
                  >
                    <template #item="{ element }">
                      <div class="summary-item w-180px!" @click="clickAddColumn(element)">
                        <span>{{ element.label }}</span>
                      </div>
                    </template>
                  </draggable>
                  <template v-for="item in tableList" :key="item.value">
                    <div
                      class="summary-title flex items-center gap-x-10px"
                      @click="
                        collapseValue == item.value
                          ? (collapseValue = '')
                          : (collapseValue = item.value)
                      "
                    >
                      <div class="flex-1">
                        <div>
                          <span>{{ item.tableName }}</span>
                          <span class="text-12px">（{{ item.tableText }}）</span>
                        </div>
                      </div>
                      <Icon
                        v-if="collapseValue == item.value"
                        :size="14"
                        icon="ep:arrow-down"
                      ></Icon>
                      <Icon
                        v-show="collapseValue != item.value"
                        :size="14"
                        icon="ep:arrow-right"
                      ></Icon>
                    </div>
                    <el-collapse-transition>
                      <div v-show="collapseValue == item.value" class="summary-draggable">
                        <draggable
                          class="summary-content pb-20px"
                          tag="div"
                          :list="item.fieldList"
                          :group="{ name: 'config', pull: 'clone', put: false }"
                          ghost-class="summary-ghost"
                          :sort="false"
                          item-key="value"
                        >
                          <template #item="{ element }">
                            <div class="summary-item" @click="clickAddColumn(element)">
                              <span>{{ element.label }}</span>
                            </div>
                          </template>
                        </draggable>
                      </div>
                    </el-collapse-transition>
                  </template>
                </el-aside>
                <el-main class="main-option">
                  <div class="c-#409EFF text-16px pl-20px pt-10px pb-10px">
                    <span>ORDER BY</span>
                    <el-popconfirm title="确认清空？" @confirm="handleEmpty('orderBy')">
                      <template #reference>
                        <el-button class="ml-10px" size="small" type="danger">清空</el-button>
                      </template>
                    </el-popconfirm>
                  </div>
                  <div class="option-content" :class="{ full: !optionObj.orderBy?.length }">
                    <draggable
                      :class="`content-draggable`"
                      :list="optionObj.orderBy"
                      :group="{ name: 'option', put: true }"
                      ghost-class="option-ghost"
                      :animation="300"
                      handle=".move-icon"
                      item-key="prop"
                      @add="(e) => handleAddColumn(e)"
                    >
                      <template #item="{ element }">
                        <div class="summary-control border-box flex">
                          <template v-if="element.controlType == 'custom'">
                            <el-popover
                              placement="bottom-start"
                              :popperStyle="{ width: 'auto', height: 'auto' }"
                              trigger="click"
                            >
                              <template #reference>
                                <div v-if="element.value" class="text-14px pr-10px cursor-pointer">
                                  {{ element.value }}
                                </div>
                                <div v-else class="text-12px c-#999"> 点击输入自定义SQL</div>
                              </template>
                              <div class="w-40vw h-200px">
                                <MonacoEditor
                                  v-model="element.value"
                                  language="mysql"
                                  :editorOption="{ minimap: false }"
                                />
                              </div>
                            </el-popover>
                          </template>
                          <template v-else>
                            <div class="mr-4px">
                              {{ aliasObj[element.tableName] || element.tableName }}.{{
                                element.value
                              }}
                            </div>
                            <avue-select
                              class="condition-select flex-basis-60px flex-shrink-0 w-60px!"
                              v-model="element.orderType"
                              :dic="orderTypeDic"
                              placeholder="排序方式"
                              :clearable="false"
                            ></avue-select>
                          </template>
                          <div class="del-icon" @click="delRow(element, 'orderBy')">
                            <Icon
                              color="#F56C6C"
                              :size="22"
                              icon="lets-icons:dell-fill"
                              class="mr-3px"
                            />
                          </div>
                          <div class="move-icon">
                            <Icon :size="22" icon="mingcute:move-line" class="mr-3px" />
                          </div>
                        </div>
                      </template>
                    </draggable>
                  </div>
                </el-main>
              </el-container>
            </div>
          </el-main>
          <el-aside width="200px">
            <div class="view-field">
              <div class="title text-center text-16px p-8px pb-9px">视图字段</div>
              <div class="view-field-content">
                <div class="content-item" v-for="item in viewField" :key="item.value">
                  {{ item.value }}（{{ item.label }}）
                </div>
              </div>
            </div>
          </el-aside>
        </el-container>
        <div class="integrality-content h-30% w-100% absolute bottom--1px left-1px">
          <div class="flex items-center h-100% w-100% bg-#f5f7fa">
            <div class="flex-basis-160px flex-shrink-0 text-center p-5px box-border">
              <div class="text-16px mb-10px">完整的SQL</div>
              <div>
                <el-button size="small" type="primary" @click="handleSqlTest">
                  <Icon :size="14" class="is-hover cursor-pointer" icon="mdi:sql-query" />
                  <span>测试</span>
                </el-button>
                <el-button
                  size="small"
                  type="primary"
                  @click="integralityDialog = !integralityDialog"
                >
                  <Icon
                    :size="14"
                    class="is-hover cursor-pointer"
                    icon="radix-icons:enter-full-screen"
                  />
                  <span>展开</span>
                </el-button>
              </div>
              <div class="mt-5px">
                <el-popconfirm title="确定清空SQL配置吗？" @confirm="emptyAllSqlData" width="190px">
                  <template #reference>
                    <el-button size="small" type="danger" @click="emptyVisible = true">
                      <Icon :size="14" class="is-hover cursor-pointer" icon="ep:delete" />
                      <span>清空SQL配置</span>
                    </el-button>
                  </template>
                </el-popconfirm>
              </div>
            </div>
            <div class="h-100% w-100%">
              <MonacoEditor
                ref="medRef"
                v-model="wholeSql"
                language="mysql"
                :editorOption="{ readOnly: true, minimap: false, lineNumbers: 'off' }"
              ></MonacoEditor>
            </div>
          </div>
        </div>
      </el-tab-pane>
      <el-tab-pane label="自定义" name="custom">
        <template #label>
          <el-radio v-model="typeTabsVal" label="custom">自定义</el-radio>
        </template>
        <div class="h-100% p-10px box-border">
          <div class="mb-10px c-#E6A23C">
            <span class="mr-20px">自定义数据源SQL</span>
            <el-button size="small" type="primary" @click="handleSqlTest('custom')">
              <Icon :size="14" class="is-hover cursor-pointer" icon="mdi:sql-query" />
              <span>测试</span>
            </el-button>
          </div>
          <div class="h-[calc(100%-30px)]">
            <MonacoEditor v-model="customSql" language="mysql"></MonacoEditor>
          </div>
        </div>
      </el-tab-pane>
    </el-tabs>

    <DesignPopup
      v-model="integralityDialog"
      title="完整的SQL"
      controlType="drawer"
      width="60%"
      :isBodyFull="true"
      :dialogParams="{ closeOnClickModal: true }"
      :editorOption="{ readOnly: true, minimap: false, lineNumbers: 'off' }"
    >
      <template #default>
        <MonacoEditor ref="medRef" v-model="wholeSql" language="mysql"></MonacoEditor>
      </template>
    </DesignPopup>
    <DesignPopup
      v-model="testPopup.show"
      title="测试结果"
      controlType="drawer"
      width="60%"
      :isBodyFull="true"
      :dialogParams="{ closeOnClickModal: true }"
    >
      <template #default>
        <MonacoEditor
          v-model="testPopup.result"
          language="json"
          :editorOption="{ readOnly: true, minimap: false, lineNumbers: 'off' }"
        ></MonacoEditor>
      </template>
    </DesignPopup>
  </div>
</template>

<script setup lang="ts">
import draggable from 'vuedraggable'
import { cloneDeep } from 'lodash-es'
import { format } from 'sql-formatter'
import * as TableApi from '@/api/design/table'
import useCopyText from '@/hooks/design/useCopyText'
defineOptions({ name: 'DataOriginOption' })

interface Props {
  show: boolean
  tableList: Array<any>
  viewField: Array<any>
}
const props = defineProps<Props>()
const isInit = ref(false)
const originStr = defineModel<string>({ default: '' })

const message = useMessage()
const { copyText } = useCopyText()
const typeTabsVal = ref('option')
const customSql = ref('')
const tabsValue = ref<any>({})
const tabsOption = ref({
  type: 'border-card',
  column: [
    { label: 'SELECT（字段）', prop: 'select' },
    { label: 'FROM（表）', prop: 'from' },
    { label: 'WHERE（过滤）', prop: 'where' },
    { label: 'GROUP BY（分组）', prop: 'groupBy' },
    { label: 'HAVING（筛选）', prop: 'having' },
    { label: 'ORDER BY（排序）', prop: 'orderBy' }
  ]
})
const customList = ref([{ label: '自定义SQL', controlType: 'custom', value: '' }])
const connectTypeDic = [
  { label: 'LEFT JOIN', value: 'LEFT JOIN' },
  { label: 'RIGHT JOIN', value: 'RIGHT JOIN' },
  { label: 'INNER JOIN', value: 'INNER JOIN' }
]
const conditionDic = [
  { label: '>', value: 'GT' },
  { label: '>=', value: 'GE' },
  { label: '<', value: 'LT' },
  { label: '<=', value: 'LE' },
  { label: '=', value: 'EQ' },
  { label: '!=', value: 'NE' },
  { label: 'BETWEEN', value: 'BETWEEN' },
  { label: 'NOT BETWEEN', value: 'NOT_BETWEEN' },
  { label: 'IN', value: 'IN' },
  { label: 'NOT IN', value: 'NOT_IN' },
  { label: 'LIKE', value: 'LIKE' },
  { label: 'NOT LIKE', value: 'NOT_LIKE' },
  { label: 'IS NULL', value: 'IS_NULL' },
  { label: 'IS NOT NULL', value: 'IS_NOT_NULL' }
]
const conditionObj = {}
conditionDic.forEach((item) => (conditionObj[item.value] = item.label))
const particularDic = [
  { label: '当前登录人租户编号', value: '#{jeelowcode_tenant_id}' },
  { label: '当前登录人id', value: '#{jeelowcode_user_id}' },
  { label: '当前人账号', value: '#{jeelowcode_user_name}' },
  { label: '当前人名称', value: '#{jeelowcode_user_nickname}' },
  { label: '登录人部门', value: '#{jeelowcode_user_dept}' }
]
const particularObj = {}
particularDic.forEach((item) => (particularObj[item.value] = item.label))
const orderTypeDic = [
  { label: '升序', value: 'ASC' },
  { label: '降序', value: 'DESC' }
]

const aliasObj = ref({})
const collapseValue = ref('')
const selectTabValue = ref('select')
const optionObj = ref({
  select: [] as any,
  from: [] as any,
  where: [] as any,
  groupBy: '',
  having: '',
  orderBy: [] as any
})
const integralityDialog = ref(false)
const emptyVisible = ref(false)
const medRef = ref()
const tabsRef = ref()

const testPopup = ref({
  show: false,
  result: '',
  type: ''
})

const wholeSql = ref('')
const wholeSqlStr = computed(() => {
  const selectStr = (optionObj.value.select || [])
    .map((item) => {
      if (item.controlType == 'custom') return item.value
      let text = `${aliasObj.value[item.tableName]}.${item.value}`
      if (item.alias) text = `${text} AS ${item.alias}`
      return text
    })
    .join(',')
  let filedNum = 0
  const formStr = (optionObj.value.from || [])
    .map((item, index) => {
      if (item.controlType == 'custom') return item.value
      const { type, tableName, value } = item
      if (type == 'table') {
        filedNum = 0
        let text = `${tableName} ${aliasObj.value[tableName]}`
        if (index != 0) text = `${item.connectType} ${text} ON`
        return text
      }
      if (type == 'field') {
        filedNum++
        return `${filedNum != 1 && filedNum % 2 == 1 ? 'AND ' : ''}${
          aliasObj.value[tableName]
        }.${value}${filedNum % 2 == 1 ? ' =' : ''}`
      }
    })
    .join(' ')
  const whereStr = (optionObj.value.where || [])
    .map((item) => {
      const fieldText = `${aliasObj.value[item.tableName] || item.tableName}.${item.value}`
      const conditionText = conditionObj[item.condition] || ''
      const { fieldType, conditionValue } = item
      if (item.controlType == 'custom') return item.value
      let text = `${fieldText} ${conditionText}`
      if (item.controlType == 'default') {
        if (item.conditionValue !== '') text = `${text} ${handleValue(fieldType, conditionValue)}`
      } else if (item.controlType == 'between') {
        if (conditionValue[0] !== '') text = `${text} ${handleValue(fieldType, conditionValue[0])}`
        if (conditionValue[1] !== '')
          text = `${text} AND ${handleValue(fieldType, conditionValue[1])}`
        return `${fieldText} ${conditionText} ${handleValue(
          item.fieldType,
          item.conditionValue[0]
        )} AND ${handleValue(item.fieldType, item.conditionValue[1])}`
      } else if (item.controlType == 'in') {
        if (conditionValue.length) text = `${text}(${handleValue(fieldType, conditionValue)})`
        else text = `${text}()`
      }
      return text
    })
    .join(' AND ')
  const orderByStr = (optionObj.value.orderBy || [])
    .map((item) => {
      return `${aliasObj.value[item.tableName] || item.tableName}.${item.value} ${item.orderType}`
    })
    .join(',')

  return `${selectStr ? 'SELECT' : ''} ${selectStr}
  ${formStr ? 'FROM' : ''} ${formStr}
  ${whereStr ? 'WHERE' : ''} ${whereStr}
  ${optionObj.value.groupBy ? 'GROUP BY' : ''} ${optionObj.value.groupBy || ''}
  ${optionObj.value.having ? 'HAVING' : ''} ${optionObj.value.having || ''}
  ${orderByStr ? 'ORDER BY' : ''} ${orderByStr}`
})

watch(
  () => wholeSqlStr.value,
  (val) => {
    try {
      const text = format(val, {
        language: 'mysql',
        params: ['#\\{[^}]+\\}']
      })
      wholeSql.value = text
    } catch {}
  }
)

const initFun = () => {
  isInit.value = false
  typeTabsVal.value = 'option'
  tabsValue.value = tabsOption.value.column[0]
  tabsRef.value.active = '0'
  aliasObj.value = {}
  optionObj.value = { select: [], from: [], where: [], groupBy: '', having: '', orderBy: [] }
  customSql.value = ''
  let aliasList: string[] = []
  props.tableList.forEach((item) => {
    let alias =
      'tbl_' +
      item.tableName
        .match(/^[a-z]|_(\w)/g)
        .map((item) => item.replace('_', ''))
        .join('')
    if (aliasList.includes(alias)) {
      const list = item.tableName.split('_')
      alias = alias.substring(0, alias.length - 1) + list[list.length - 1]
    }
    aliasObj.value[item.tableName] = alias
    aliasList.push(alias)
  })
  if (originStr.value && originStr.value !== '{}') {
    const data = JSON.parse(originStr.value)
    customSql.value = data.customSql || ''
    if (data.typeKey) typeTabsVal.value = data.typeKey

    aliasObj.value = {
      ...data.aliasObj,
      ...aliasObj.value
    }
    for (const key in data.optionObj) {
      optionObj.value[key] = data.optionObj[key]
    }
  }
  setTimeout(() => {
    isInit.value = true
  }, 200)
}

watch(
  () => props.show,
  (val) => {
    if (val) initFun()
  }
)

const handleEmpty = (type) => {
  if (['groupBy', 'having'].includes(type)) optionObj.value[type] = ''
  else optionObj.value[type] = []
}
const emptyAllSqlData = () => {
  for (const key in optionObj.value) handleEmpty(key)
}

const handleAddData = (data, newIndex?) => {
  const type = tabsValue.value.prop
  if (!data.prop) data.prop = `option_${Math.ceil(Math.random() * 9999999)}`
  if (!data.controlType) data.controlType = 'text'
  if (type == 'select') data.alias = ''
  if (type == 'from') {
    if (data.type == 'table') {
      delete data.fieldList
      delete data.label
      delete data.tableText
      delete data.value
      data.connectType = 'INNER JOIN'
    }
  }
  if (type == 'where') {
    if (!data.controlType) {
      data.condition = 'EQ'
      data.controlType = 'default'
    }
  }
  if (type == 'orderBy') data.orderType = 'DESC'
  if (newIndex === undefined) optionObj.value[type].push(data)
  else optionObj.value[type][newIndex] = data
}

const handleAddColumn = (e) => {
  const newIndex = e.newIndex
  let data = cloneDeep(optionObj.value[tabsValue.value.prop][newIndex])
  handleAddData(data, newIndex)
}

const clickAddColumn = (data) => {
  handleAddData(cloneDeep(data))
}

const delRow = (row, type) => {
  optionObj.value[type] = optionObj.value[type].filter((item) => item.prop != row.prop)
}

const whereTypeChange = (data, index) => {
  if (!isInit.value) return
  const row = optionObj.value.where[index]
  if (['GT', 'GE', 'LT', 'LE', 'EQ', 'NE', 'LIKE', 'NOT_LIKE'].includes(data.value)) {
    row.conditionValue = ''
    row.controlType = 'default'
  } else if (['IS_NULL', 'IS_NOT_NULL'].includes(data.value)) {
    row.controlType = 'text'
  } else if (['BETWEEN', 'NOT_BETWEEN'].includes(data.value)) {
    row.conditionValue = ['', '']
    row.controlType = 'between'
  } else if (['IN', 'NOT_IN'].includes(data.value)) {
    row.conditionValue = []
    row.controlType = 'in'
  }
  setSelectWidth(row, 0, '_where')
}

const getOptionStr = () => {
  let bool = false
  for (let key in optionObj.value) {
    const value = optionObj.value[key]
    if (value instanceof Array && value.length) bool = true
    else if (value) bool = true
  }
  if (!bool) return ''

  return JSON.stringify({
    optionObj: optionObj.value,
    customSql: customSql.value,
    aliasObj: aliasObj.value,
    typeKey: typeTabsVal.value,
    executeSql: typeTabsVal.value == 'option' ? wholeSql.value : customSql.value
  })
}

const getFromFieldChars = (index) => {
  let num = 0
  for (const i in optionObj.value.from) {
    const formIndex = Number(i)
    if (formIndex > index) break
    const item = optionObj.value.from[formIndex]
    if (item.type == 'field') {
      num++
      if (formIndex == index) {
        if (num % 2 == 1) return ' ='
        else if (
          optionObj.value.from[formIndex + 1] &&
          optionObj.value.from[formIndex + 1].type == 'field'
        ) {
          return ' AND'
        }
      }
    }
  }
}

const setGroupByText = async () => {
  if (!optionObj.value.select.length) return message.info('请先配置SELECT内容')
  await message.confirm('当前操作将会覆盖原有的GROUP BY内容,是否确定根据SELECT生成GROUP BY内容?')
  const groupList: string[] = []
  optionObj.value.select.forEach((item) => {
    if (item.controlType == 'text') {
      groupList.push(`${aliasObj.value[item.tableName] || item.tableName}.${item.value}`)
    }
  })
  optionObj.value.groupBy = groupList.join(',\n')
}

const handleValue = (filedType, value) => {
  let whereType = 'string'
  const valueType = value instanceof Array ? 'array' : 'string'

  const setValueFormat = (val) => {
    if (!val) return val
    let text = val
    if (!particularObj[text] && whereType == 'string' && val.indexOf(`'`) == -1) {
      text = `'${val}'`
    }
    return text
  }
  if (['BigInt', 'BigDecimal', 'Integer'].includes(filedType)) whereType = 'number'
  if (valueType == 'string') value = [value]
  value = value.map((item) => setValueFormat(item)).join(',')
  return value
}

const setSelectWidth = (element, num = 0, addClass = '') => {
  if (!isInit.value) return
  setTimeout(() => {
    const el = document.querySelector(
      `.origin-content .main-option .select_${element.prop}${addClass} .el-select__selected-item.el-select__placeholder span`
    ) as HTMLSpanElement
    if (!el) return
    const width = el.offsetWidth
    element[`width${addClass}`] = width + 34 + num + 'px'
  }, 30)
}

const handleSqlTest = async (type?) => {
  await message.confirm('是否确定测试当前SQL?')
  const data = await TableApi.viewDataOriginTest({
    explainSql: type == 'custom' ? customSql.value : wholeSql.value
  })
  if (data.records) {
    testPopup.value = {
      result: JSON.stringify(data, null, '\t'),
      type: 'success',
      show: true
    }
  }
}

onMounted(() => {
  initFun()
})

defineExpose({ getOptionStr })
</script>

<style lang="scss" scoped>
.data-origin-option {
  position: relative;
  width: 100%;
  height: 100%;
  overflow: hidden;

  .view-field {
    height: 70%;
    border-left: 1px solid #dcdfe6;

    .title {
      border-bottom: 1px solid #dcdfe6;
    }

    .view-field-content {
      height: calc(100% - 39px);
      padding: 10px 8px;
      overflow: hidden auto;
      box-sizing: border-box;

      .content-item {
        padding: 5px;
        margin-bottom: 5px;
        background-color: #f5f7fa;

        &:nth-last-child(1) {
          border-bottom: none;
        }
      }
    }
  }

  .integrality-content {
    border-top: 1px solid #dcdfe6;
  }

  .origin-content {
    height: calc(70% - 39px);

    &.select-content {
      .left-tree {
        .summary-item {
          width: 200px;
        }

        &::v-deep(.select-tab-content.el-tabs) {
          height: 100%;

          .el-tabs__header {
            padding: 0 10px;
            margin-bottom: 10px;

            .el-tabs__nav {
              width: 100%;
              box-sizing: box-border;

              .el-tabs__active-bar {
                width: 50% !important;
              }

              .el-tabs__item {
                padding: 0;
                flex: 1;
              }
            }
          }

          .el-tabs__content {
            height: calc(100% - 50px);
          }

          .el-tab-pane {
            height: 100%;
            overflow: hidden auto;

            &::-webkit-scrollbar {
              width: 0;
            }

            .alias-item {
              border-bottom: 1px solid #f1f1f1;

              &:nth-last-of-type(1) {
                margin-bottom: 0;
              }
            }
          }
        }
      }

      .summary-draggable {
        height: calc(100% - 80px);
      }

      .border-box {
        ::v-deep(.el-input__wrapper) {
          padding: 0;
          margin-top: -1px;
          box-shadow: none;
        }
      }

      .main-option .option-content.full::before {
        content: '拖拽表字段，配置SELECT';
      }
    }

    &.from-content,
    &.where-content,
    &.orderby-content {
      .left-tree {
        height: 100%;
        padding: 10px 10px 0;
        overflow: hidden auto;

        &::-webkit-scrollbar {
          width: 0;
        }

        .summary-item {
          width: 160px;
        }
      }

      .summary-draggable {
        height: calc(100% - 100px);
      }

      .summary-control {
        .condition-select {
          ::v-deep(.el-select__wrapper) {
            padding: 1px 5px;
            text-align: center;

            .el-select__icon {
              margin-left: 0;
            }
          }
        }

        ::v-deep(.el-input__wrapper),
        ::v-deep(.el-select__wrapper) {
          box-shadow: none;

          &.is-focus {
            box-shadow: none !important;
          }
        }
      }
    }

    &.from-content {
      ::v-deep(.el-input__wrapper) {
        padding: 0;

        .el-select__icon {
          margin-left: 0;
        }
      }

      .main-option .option-content.full::before {
        content: '拖拽表和表字段，配置FORM';
      }
    }

    &.where-content {
      ::v-deep(.el-input__wrapper) {
        padding: 0 5px;

        .el-input__inner {
          text-align: center;
        }
      }

      .main-option .option-content.full::before {
        content: '拖拽表字段，配置WHERE';
      }
    }

    &.orderby-content {
      .main-option .option-content.full::before {
        content: '拖拽表字段，配置ORDER BY';
      }
    }

    &.groupby-content,
    &.having-content {
      .option-content {
        padding: 10px 20px;
        box-sizing: border-box;
      }
    }
  }

  .left-tree {
    height: 100%;
    border-right: 1px solid #f1f1f1;

    .summary-title {
      display: flex;
      align-items: center;
      padding: 4px 6px;
      margin-bottom: 10px;
      font-size: 14px;
      color: #333;
      cursor: pointer;
      background-color: #ecf5ff;
      border-radius: 2px;

      .el-icon {
        color: #666;
      }
    }

    &:nth-last-of-type(1) {
      margin-bottom: 0;
    }

    .summary-draggable {
      margin-left: 10px;
      overflow: hidden auto;
    }

    .summary-item {
      padding: 4px 8px;
      margin-bottom: 10px;
      font-size: 14px;
      cursor: move;
      background-color: #f4f6fc;
      border: 1px dashed #f4f6fc;

      &:nth-last-of-type(1) {
        margin-bottom: 0;
      }

      &:hover {
        color: var(--el-color-primary);
        border-color: var(--el-color-primary);
      }
    }
  }

  .main-option {
    padding: 0;
    border-left: 0;

    .option-content {
      position: relative;
      height: calc(100% - 46px);
      border-top: 1px solid #dcdfe6;

      &.full {
        ::v-deep(.el-scrollbar__view) {
          height: 100%;

          .content-draggable {
            height: 100%;
          }
        }

        &::before {
          position: absolute;
          top: 10px;
          left: 10px;
          font-size: 16px;
          color: #999;
        }
      }

      .content-draggable {
        display: flex;
        height: 100%;
        padding: 10px;
        padding-bottom: 40px;
        overflow-y: auto;
        box-sizing: border-box;
        flex-wrap: wrap;
        gap: 10px 8px;
        align-content: flex-start;

        .summary-control {
          position: relative;

          .del-icon {
            position: absolute;
            top: -9px;
            left: -8px;
            display: none;
            cursor: pointer;
          }

          .move-icon {
            position: absolute;
            right: -14px;
            bottom: -9px;
            display: none;
            cursor: move;
          }

          &:hover {
            .del-icon {
              display: block;
            }

            .move-icon {
              display: block;
            }
          }
        }
      }

      .option-ghost {
        position: relative;
        width: 0 !important;
        height: 32px;
        min-width: 0 !important;
        padding: 0 !important;
        overflow: hidden;
        font-size: 0;
        background: white;
        border-left: 5px solid var(--el-color-primary);
        content: '';
        outline: none 0;
        box-sizing: border-box;
      }
    }

    .summary-result {
      border-top: 1px solid #dcdfe6;
    }
  }

  .right-custom {
    .custom-title {
      display: flex;
      align-items: center;
      justify-content: center;
      height: 32px;
      padding: 4px 0;
      font-size: 14px;
      line-height: 32px;
      text-align: center;
      background-color: #fafafa;
      border: 1px solid #dcdfe6;
    }

    .custom-content {
      width: 100%;
      height: calc(100% - 42px);
    }
  }

  .custom-box {
    height: calc(100% - 51px);
  }

  & > ::v-deep(.el-tabs) {
    .el-tabs__header {
      margin-right: 0 !important;
    }

    .el-tab-pane {
      height: 100%;
    }

    .el-tabs__item {
      display: flex;
      padding: 0 12px;
      justify-content: center;
    }
  }

  ::v-deep(.el-tabs__content) {
    height: 100%;
    padding: 0;
  }

  ::v-deep(.avue-tabs) .el-tabs {
    height: calc(100% - 43px);
    border: none;
  }
}

.border-box {
  min-height: 30px;
  padding: 1px 11px;
  line-height: 30px;
  border-radius: 5px;
  box-shadow: 0 0 0 1px var(--el-input-border-color, var(--el-border-color)) inset;
}

.data-origin-option.full ::v-deep(.el-tabs) .el-tabs__content {
  height: 100%;
}
</style>
