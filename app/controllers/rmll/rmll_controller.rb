module Rmll
    class RmllController < ActionController::Base
        layout "rmll"

        before_action :set_locale

        def set_locale
          # FIXME remove hard written locale "fr"
          I18n.locale = "fr" || params[:locale] || I18n.default_locale
        end

        def index
          render "rmll/index"
        end

        def static_pages
          if params[:page].nil?
            render "rmll/#{params[:heading]}"
          elsif params[:sub].nil?
            render "rmll/#{params[:heading]}/#{params[:page]}"
          else
            render "rmll/#{params[:heading]}/#{params[:page]}/#{params[:sub]}"
          end
        end
    end
end
