module Rmll
  class RmllController < ApplicationController
    layout "rmll"
    skip_authorization_check

    before_action :set_locale

    def set_locale
      I18n.locale = params[:locale] || I18n.default_locale
      puts I18n.default_locale
    end

    def default_url_options
      { locale: I18n.locale }
    end

    def index
      if params[:heading].nil?
        render "rmll/index"
      elsif params[:page].nil?
        render "rmll/#{params[:heading]}"
      elsif params[:sub].nil?
        render "rmll/#{params[:heading]}/#{params[:page]}"
      else
        render "rmll/#{params[:heading]}/#{params[:page]}/#{params[:sub]}"
      end
    end
  end
end
