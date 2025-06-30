<?php

namespace Drupal\ui_patterns;

use Drupal\Core\Form\FormStateInterface;

/**
 * Trait for widget settings.
 */
trait WidgetSettingTrait {

  /**
   * The plugin widget settings.
   *
   * @var array
   */
  protected $widgetSettings = [];

  /**
   * Whether default settings have been merged into the current $settings.
   *
   * @var bool
   */
  protected $defaultWidgetSettingsMerged = FALSE;

  /**
   * {@inheritdoc}
   */
  public function defaultWidgetSettings(): array {
    return ['required' => FALSE, 'title' => ''];
  }

  /**
   * Merges default widget settings values into $settings.
   */
  protected function mergeWidgetDefaults() : void {
    $this->widgetSettings += $this->defaultWidgetSettings();
    $this->defaultWidgetSettingsMerged = TRUE;
  }

  /**
   * {@inheritdoc}
   */
  public function getWidgetSetting(string $key): mixed {
    if (!$this->defaultWidgetSettingsMerged && !array_key_exists($key, $this->widgetSettings)) {
      $this->mergeWidgetDefaults();
    }
    return $this->widgetSettings[$key] ?? NULL;
  }

  /**
   * {@inheritdoc}
   */
  public function setWidgetSettings(array $settings): PluginWidgetSettingsInterface {
    $this->widgetSettings = $settings;
    $this->defaultWidgetSettingsMerged = FALSE;
    return $this;
  }

  /**
   * {@inheritdoc}
   */
  public function setConfiguration(array $configuration) : void {
    if (isset($configuration['widget_settings'])) {
      $this->setWidgetSettings($configuration['widget_settings']);
    }
    parent::setConfiguration($configuration);
  }

  /**
   * {@inheritdoc}
   */
  public function widgetSettingsForm(array $form, FormStateInterface $form_state): array {
    return [
      'required' =>
        [
          '#title' => $this->t('Required'),
          '#type' => 'checkbox',
          '#default_value' => $this->getWidgetSetting('required') ?? FALSE,
        ],
      'title' =>
        [
          '#title' => $this->t('Title'),
          '#type' => 'textfield',
          '#default_value' => $this->getWidgetSetting('title') ?? '',
        ],
    ];
  }

  /**
   * {@inheritdoc}
   */
  protected function addRequired(array &$form_element): void {
    parent::addRequired($form_element);
    if ($this->getWidgetSetting("required") == TRUE) {
      $form_element['#required'] = TRUE;
    }
  }

}
