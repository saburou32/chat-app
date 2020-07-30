export const strict = false

export const state = () => {
  // user認証情報格納用変数
  return {
    user: null
  }
}

export const getters = {
  // ログイン確認
  isAuthenticated(state) {
    return !!state.user
  }
}

export const mutations = {
  // stateのuserにactionsからきた値セット
  setUser(state, user) {
    state.user = user
  }
}

export const actions = {
  // mutationsのsetUserに引数の値を渡す
  setUser(context, user) {
    context.commit('setUser', user)
  }
}