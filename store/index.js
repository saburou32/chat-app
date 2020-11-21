export const strict = false

export const state = () => {
  // user認証情報格納用変数
  return {
    user: null,
    channelId: null,
    channelName: null,
    channelMembers: null,
  }
}

export const getters = {
  // ログイン確認
  isAuthenticated: state => !!state.user,
  currentUser: state => state.user,
  currentChannel: state => state.channelId,
  currentChannelName: state => state.channelName,
  currentChannelMembers: state => state.channelMembers,
}

export const mutations = {
  // stateのuserにactionsからきた値セット
  setUser(state, user) {
    state.user = user
  },

  setChannelId(state, channelId) {
    state.channelId = channelId
  },

  setChannelName(state, channelName) {
    state.channelName = channelName
  },

  setChannelMembers(state, channelMembers) {
    state.channelMembers = channelMembers
  },
}

export const actions = {
  // mutationsのsetUserに引数の値を渡す
  setUser(context, user) {
    context.commit('setUser', user)
  },

  setChannelId(context, channelId) {
    context.commit('setChannelId', channelId)
  },

  setChannelName(context, channelName) {
    context.commit('setChannelName', channelName)
  },

  setChannelMembers(context, channelMembers) {
    context.commit('setChannelMembers', channelMembers)
  },
}