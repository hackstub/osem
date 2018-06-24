module Rmll
  class RmllController < ApplicationController
    skip_authorization_check

    before_action :set_locale

    after_action :push_headers

    def set_locale
      I18n.locale = params[:locale] || I18n.default_locale
      puts I18n.default_locale
    end

    def push_headers
      if request.format.html? # only on html pages
        response.headers['Link'] = [
          "<#{view_context.asset_path('rmll/stylesheet.css')}>; rel=preload; as=style",
          "<#{view_context.asset_path('rmll/lib/menu.js')}>; rel=preload; as=script",
          "<#{view_context.asset_path('rmll/script.js')}>; rel=preload; as=script",
          "<#{view_context.asset_path('rmll/SpaceMono-Regular-webfont.woff')}>; rel=preload; as=font; crossorigin",
          "<#{view_context.asset_path('rmll/SpaceMono-Italic-webfont.woff')}>; rel=preload; as=font; crossorigin",
          "<#{view_context.asset_path('rmll/SpaceMono-Bold-webfont.woff')}>; rel=preload; as=font; crossorigin"
        ]
      end
    end

    def default_url_options
      { locale: I18n.locale }
    end

    def index
      # Kinda hacky but it works.
      layout = ('rmll' unless params[:page] == 'cfp')

      @conference = if ENV['OSEM_ROOT_CONFERENCE'].blank?
                      Conference.first
                    else
                      Conference.find_by(short_title: ENV['OSEM_ROOT_CONFERENCE'])
                    end

      if params[:heading].nil?
        render 'rmll/index', layout: layout
      elsif params[:page].nil?
        render "rmll/#{params[:heading]}", layout: layout
      elsif params[:sub].nil?
        render "rmll/#{params[:heading]}/#{params[:page]}", layout: layout
      else
        render "rmll/#{params[:heading]}/#{params[:page]}/#{params[:sub]}", layout: layout
      end
    end
  end
end
